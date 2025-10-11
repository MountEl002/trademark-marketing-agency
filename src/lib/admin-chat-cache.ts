// lib/admin-chat-cache.ts

import { ChatType, DB_NAMES } from "@/lib/constants";
import { ChatDocument, Message } from "./chat-functions";

const DB_NAME = DB_NAMES.ADMIN_CHATS_AND_MESSAGES;
const DB_VERSION = 1;

// Object store names
const CHAT_DOCUMENTS_STORE = "chatDocuments";
const MESSAGES_STORE = "messages";

export interface StoredChatDocument extends ChatDocument {
  lastCacheUpdate: number;
}

export interface StoredMessage extends Message {
  chatId: string;
  chatType: ChatType;
}

interface DatabaseMetadata {
  lastFullSync: number;
  totalChatsCount: number;
  hasInitialData: boolean;
}

// Initialize and get IndexedDB database
export const getAdminChatDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create chat documents store
      if (!db.objectStoreNames.contains(CHAT_DOCUMENTS_STORE)) {
        const chatStore = db.createObjectStore(CHAT_DOCUMENTS_STORE, {
          keyPath: "id",
        });
        chatStore.createIndex("chatType", "chatType", { unique: false });
        chatStore.createIndex(
          "latestMessageTimestamp",
          "latestMessageTimestamp",
          { unique: false }
        );
        chatStore.createIndex("lastCacheUpdate", "lastCacheUpdate", {
          unique: false,
        });
      }

      // Create messages store
      if (!db.objectStoreNames.contains(MESSAGES_STORE)) {
        const messageStore = db.createObjectStore(MESSAGES_STORE, {
          keyPath: "id",
        });
        messageStore.createIndex("chatId", "chatId", { unique: false });
        messageStore.createIndex("chatType", "chatType", { unique: false });
        messageStore.createIndex("timestamp", "timestamp", { unique: false });
        messageStore.createIndex("sender", "sender", { unique: false });
        messageStore.createIndex("chatId_timestamp", ["chatId", "timestamp"], {
          unique: false,
        });
      }
    };
  });
};

// Store single chat document
export const storeChatDocumentInCache = async (
  chatDoc: ChatDocument
): Promise<void> => {
  const db = await getAdminChatDatabase();
  const transaction = db.transaction([CHAT_DOCUMENTS_STORE], "readwrite");
  const store = transaction.objectStore(CHAT_DOCUMENTS_STORE);

  const storedDoc: StoredChatDocument = {
    ...chatDoc,
    lastCacheUpdate: Date.now(),
  };

  return new Promise((resolve, reject) => {
    const request = store.put(storedDoc);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

// Store multiple chat documents in batch
export const storeChatDocumentsInCache = async (
  chatDocs: ChatDocument[]
): Promise<void> => {
  const db = await getAdminChatDatabase();
  const transaction = db.transaction([CHAT_DOCUMENTS_STORE], "readwrite");
  const store = transaction.objectStore(CHAT_DOCUMENTS_STORE);

  const now = Date.now();
  const promises = chatDocs.map((chatDoc) => {
    const storedDoc: StoredChatDocument = {
      ...chatDoc,
      lastCacheUpdate: now,
    };

    return new Promise<void>((resolve, reject) => {
      const request = store.put(storedDoc);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  });

  await Promise.all(promises);
};

// Get single chat document from cache
export const getChatDocumentFromCache = async (
  chatId: string
): Promise<StoredChatDocument | null> => {
  const db = await getAdminChatDatabase();
  const transaction = db.transaction([CHAT_DOCUMENTS_STORE], "readonly");
  const store = transaction.objectStore(CHAT_DOCUMENTS_STORE);

  return new Promise((resolve, reject) => {
    const request = store.get(chatId);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
};

// Get all chat documents from cache
export const getAllChatDocumentsFromCache = async (): Promise<
  StoredChatDocument[]
> => {
  const db = await getAdminChatDatabase();
  const transaction = db.transaction([CHAT_DOCUMENTS_STORE], "readonly");
  const store = transaction.objectStore(CHAT_DOCUMENTS_STORE);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

// Store single message
export const storeMessageInCache = async (
  message: Message,
  chatId: string,
  chatType: ChatType
): Promise<void> => {
  const db = await getAdminChatDatabase();
  const transaction = db.transaction([MESSAGES_STORE], "readwrite");
  const store = transaction.objectStore(MESSAGES_STORE);

  const storedMessage: StoredMessage = {
    ...message,
    chatId,
    chatType,
  };

  return new Promise((resolve, reject) => {
    const request = store.put(storedMessage);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

// Store multiple messages in batch
export const storeMessagesInCache = async (
  messages: Message[],
  chatId: string,
  chatType: ChatType
): Promise<void> => {
  const db = await getAdminChatDatabase();
  const transaction = db.transaction([MESSAGES_STORE], "readwrite");
  const store = transaction.objectStore(MESSAGES_STORE);

  const promises = messages.map((message) => {
    const storedMessage: StoredMessage = {
      ...message,
      chatId,
      chatType,
    };

    return new Promise<void>((resolve, reject) => {
      const request = store.put(storedMessage);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  });

  await Promise.all(promises);
};

// Get all messages for a chat
export const getChatMessagesFromCache = async (
  chatId: string
): Promise<StoredMessage[]> => {
  const db = await getAdminChatDatabase();
  const transaction = db.transaction([MESSAGES_STORE], "readonly");
  const store = transaction.objectStore(MESSAGES_STORE);
  const index = store.index("chatId");

  return new Promise((resolve, reject) => {
    const request = index.getAll(chatId);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const messages = request.result.sort((a, b) => a.timestamp - b.timestamp);
      resolve(messages);
    };
  });
};

// Get message count for a chat
export const getMessageCountForChat = async (
  chatId: string
): Promise<number> => {
  const db = await getAdminChatDatabase();
  const transaction = db.transaction([MESSAGES_STORE], "readonly");
  const store = transaction.objectStore(MESSAGES_STORE);
  const index = store.index("chatId");

  return new Promise((resolve, reject) => {
    const request = index.count(chatId);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

// Delete single message
export const deleteMessageFromCache = async (
  messageId: string
): Promise<void> => {
  const db = await getAdminChatDatabase();
  const transaction = db.transaction([MESSAGES_STORE], "readwrite");
  const store = transaction.objectStore(MESSAGES_STORE);

  return new Promise((resolve, reject) => {
    const request = store.delete(messageId);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

// Delete all messages for a chat
export const deleteChatMessagesFromCache = async (
  chatId: string
): Promise<void> => {
  const db = await getAdminChatDatabase();
  const transaction = db.transaction([MESSAGES_STORE], "readwrite");
  const store = transaction.objectStore(MESSAGES_STORE);
  const index = store.index("chatId");

  return new Promise((resolve, reject) => {
    const request = index.getAllKeys(chatId);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const keys = request.result;
      const deletePromises = keys.map((key) => {
        return new Promise<void>((deleteResolve, deleteReject) => {
          const deleteRequest = store.delete(key);
          deleteRequest.onerror = () => deleteReject(deleteRequest.error);
          deleteRequest.onsuccess = () => deleteResolve();
        });
      });

      Promise.all(deletePromises)
        .then(() => resolve())
        .catch(reject);
    };
  });
};

// Delete single chat document
export const deleteChatDocumentFromCache = async (
  chatId: string
): Promise<void> => {
  const db = await getAdminChatDatabase();
  const transaction = db.transaction([CHAT_DOCUMENTS_STORE], "readwrite");
  const store = transaction.objectStore(CHAT_DOCUMENTS_STORE);

  return new Promise((resolve, reject) => {
    const request = store.delete(chatId);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

// Delete chat document and all associated messages
export const deleteCompleteChatFromCache = async (
  chatId: string
): Promise<void> => {
  // Delete messages first, then chat document
  await deleteChatMessagesFromCache(chatId);
  await deleteChatDocumentFromCache(chatId);
};

// Get database metadata
export const getChatDatabaseMetadata = async (): Promise<DatabaseMetadata> => {
  const chatDocs = await getAllChatDocumentsFromCache();
  const oldestCacheUpdate = chatDocs.reduce(
    (oldest, doc) => Math.min(oldest, doc.lastCacheUpdate),
    Date.now()
  );

  return {
    lastFullSync: oldestCacheUpdate,
    totalChatsCount: chatDocs.length,
    hasInitialData: chatDocs.length > 0,
  };
};
