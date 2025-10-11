//lib/chat-functions.ts

import { ChatType, DB_NAMES } from "@/lib/constants";
import { DocumentReference, FieldValue, updateDoc } from "firebase/firestore";

export interface ChatDocument {
  id: string;
  createdAt?: number | FieldValue;
  userNumber?: string | null;
  latestMessage?: string;
  latestMessageTimestamp: number;
  adminLastReadTimestamp?: number;
  userLastReadTimestamp?: number;
  chatType: ChatType;
  messageCount: number | FieldValue;
  hasOnlyAdminMessage: boolean;
  userActive?: boolean;
  unreadAdminMessageCount?: number | FieldValue;
  unreadUserMessageCount?: number | FieldValue;
  lastSeenOnline?: number;
}

export interface Message {
  id?: string;
  text: string;
  sender: "user" | "admin";
  timestamp: number;
  userNumber?: string;
  isSystemGenerated?: boolean;
  files?: Array<{
    id?: string;
    fileName: string;
    fileKey: string;
    fileSize?: number;
    fileType?: string;
  }>;
}

export interface CachedChatData {
  chatId: string;
  chatType: string;
  messages: Message[];
  messageCount: number;
}

export interface CacheMetadata {
  hasInitialData: boolean;
  totalChatsCount: number;
}

export interface CachedMessage {
  id: string;
  text: string;
  sender: "user" | "admin";
  timestamp: number;
  files?: Array<{
    id?: string;
    fileName: string;
    fileKey: string;
    fileSize?: number;
    fileType?: string;
  }>;
}

export interface ChatMessagesCache {
  chatId: string;
  chatType: string;
  messages: CachedMessage[];
  lastCacheUpdate: number;
  totalMessageCount: number;
}

export interface CacheMetadata {
  lastFullSync: number;
  totalChatsCount: number;
  hasInitialData: boolean;
}

export const collections = [
  { name: "registeredUsersChats", type: "registeredUsersChats" as const },
  {
    name: "unregisteredUsersChats",
    type: "unregisteredUsersChats" as const,
  },
];

// Functions shared by admin and normal user sides

export const formatMessagePreview = (
  text: string,
  numberOfFiles: number
): string => {
  let preview = "";

  if (text.trim()) {
    preview = text.length > 50 ? `${text.substring(0, 50)}...` : text;
  }

  if (numberOfFiles > 0) {
    const attachmentText = `${numberOfFiles} file${
      numberOfFiles > 1 ? "s" : ""
    }`;

    if (preview) {
      // If there's text, add attachment info
      preview = ` | ${attachmentText} |  ${text.substring(0, 50)}...`;
    } else {
      // If no text, just show attachment info
      preview = `Attached ${attachmentText}`;
    }
  }

  return preview;
};

export const formatMessageTimestamp = (timestamp: number): string => {
  const messageDate = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - messageDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  if (diffHours < 24) {
    return `${messageDate.getHours().toString().padStart(2, "0")}:${messageDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  } else if (diffDays < 7) {
    const dayName = messageDate.toLocaleDateString(undefined, {
      weekday: "long",
    });
    const time = `${messageDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${messageDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    return `${dayName}, ${time}`;
  } else {
    const day = messageDate.getDate().toString().padStart(2, "0");
    const month = (messageDate.getMonth() + 1).toString().padStart(2, "0");
    const year = messageDate.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

export const getUserStatus = (
  lastSeenOnline: number,
  formatMessageTimestamp: (timestamp: number) => string
): { isActive: boolean; statusText: string } => {
  const now = Date.now();
  const threeMinutesInMs = 3 * 60 * 1000; // 3 minutes in milliseconds
  const timeDifference = now - lastSeenOnline;

  if (timeDifference < threeMinutesInMs) {
    return {
      isActive: true,
      statusText: "Active",
    };
  }

  return {
    isActive: false,
    statusText: `Last seen: ${formatMessageTimestamp(lastSeenOnline)}`,
  };
};

export const getCacheDbNames = (chatType: ChatType) => {
  if (chatType === "registeredUsersChats") {
    return {
      messagesDb: DB_NAMES.AUTHENTICATED_CHAT,
      filesDb: DB_NAMES.AUTHENTICATED_CHAT_FILES,
    };
  } else {
    return {
      messagesDb: DB_NAMES.UNAUTHENTICATED_CHAT,
      filesDb: DB_NAMES.UNAUTHENTICATED_CHAT_FILES,
    };
  }
};

export const typedUpdateChatDoc = async (
  docRef: DocumentReference,
  updates: Partial<ChatDocument>
) => {
  return updateDoc(docRef, updates);
};

// Functions for normal user side messages caching

/**
 * Get or create the chat cache database
 */
const chatDbConnections = new Map<string, Promise<IDBDatabase>>();
const CHAT_DB_VERSION = 1;

function getChatDatabase(dbName: string): Promise<IDBDatabase> {
  if (!chatDbConnections.has(dbName)) {
    const dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(dbName, CHAT_DB_VERSION);

      request.onerror = () => {
        console.error(`Chat cache DB open error for ${dbName}:`, request.error);
        chatDbConnections.delete(dbName);
        reject(request.error);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Chat previews store
        if (!db.objectStoreNames.contains("chatPreviews")) {
          const chatPreviewsStore = db.createObjectStore("chatPreviews", {
            keyPath: "id",
          });
          chatPreviewsStore.createIndex("chatType", "chatType", {
            unique: false,
          });
          chatPreviewsStore.createIndex(
            "lastMessageTimestamp",
            "lastMessageTimestamp",
            { unique: false }
          );
        }

        // Individual chat messages store
        if (!db.objectStoreNames.contains("chatMessages")) {
          const chatMessagesStore = db.createObjectStore("chatMessages", {
            keyPath: "chatId",
          });
          chatMessagesStore.createIndex("chatType", "chatType", {
            unique: false,
          });
        }

        // Cache metadata store
        if (!db.objectStoreNames.contains("cacheMetadata")) {
          db.createObjectStore("cacheMetadata", { keyPath: "key" });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };
    });

    chatDbConnections.set(dbName, dbPromise);
  }

  return chatDbConnections.get(dbName)!;
}

/**
 * Cache messages for a specific chat
 */
export async function cacheChatMessages(
  dbName: string,
  chatId: string,
  chatType: string,
  messages: Message[]
): Promise<void> {
  try {
    const db = await getChatDatabase(dbName);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["chatMessages"], "readwrite");
      const store = transaction.objectStore("chatMessages");

      const cachedData: CachedChatData = {
        chatId,
        chatType,
        messages: messages.map((msg) => ({
          ...msg,
          // Remove file buffers, keep only metadata
          files: msg.files?.map((file) => ({
            id: file.id,
            fileName: file.fileName,
            fileKey: file.fileKey,
            fileSize: file.fileSize,
            fileType: file.fileType,
          })),
        })),
        messageCount: messages.length,
      };

      const putRequest = store.put(cachedData);

      putRequest.onsuccess = () => {
        resolve();
      };

      putRequest.onerror = () => {
        console.error(
          `Error caching chat messages in ${dbName}:`,
          putRequest.error
        );
        reject(putRequest.error);
      };

      transaction.onerror = () => {
        console.error(
          `Transaction error caching messages in ${dbName}:`,
          transaction.error
        );
        reject(transaction.error);
      };

      transaction.onabort = () => {
        console.error(`Transaction aborted caching messages in ${dbName}`);
        reject(new Error("Transaction aborted"));
      };
    });
  } catch (error) {
    console.error(`Failed to cache chat messages in ${dbName}:`, error);
    throw error;
  }
}

/**
 * Get cached messages for a specific chat
 */
export async function getCachedChatMessages(
  dbName: string,
  chatId: string
): Promise<Message[]> {
  try {
    const db = await getChatDatabase(dbName);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["chatMessages"], "readonly");
      const store = transaction.objectStore("chatMessages");
      const getRequest = store.get(chatId);

      getRequest.onsuccess = () => {
        const cachedData: CachedChatData | undefined = getRequest.result;
        resolve(cachedData?.messages || []);
      };

      getRequest.onerror = () => {
        console.error(
          `Error getting cached chat messages from ${dbName}:`,
          getRequest.error
        );
        reject(getRequest.error);
      };

      transaction.onerror = () => {
        console.error(
          `Transaction error getting cached messages from ${dbName}:`,
          transaction.error
        );
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error(`Failed to get cached chat messages from ${dbName}:`, error);
    return [];
  }
}

/**
 * Remove a chat from cache (when deleted)
 */
export async function removeCachedChat(
  dbName: string,
  chatId: string
): Promise<void> {
  try {
    const db = await getChatDatabase(dbName);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        ["chatPreviews", "chatMessages"],
        "readwrite"
      );
      const previewsStore = transaction.objectStore("chatPreviews");
      const messagesStore = transaction.objectStore("chatMessages");

      previewsStore.delete(chatId);
      messagesStore.delete(chatId);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        console.error(
          `Error removing cached chat from ${dbName}:`,
          transaction.error
        );
        reject(transaction.error);
      };

      transaction.onabort = () => {
        console.error(
          `Transaction aborted removing cached chat from ${dbName}`
        );
        reject(new Error("Transaction aborted"));
      };
    });
  } catch (error) {
    console.error(`Failed to remove cached chat from ${dbName}:`, error);
    throw error;
  }
}
