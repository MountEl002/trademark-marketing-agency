"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  doc,
  updateDoc,
  where,
  increment,
  Unsubscribe,
  limit,
} from "firebase/firestore";
import Image from "next/image";
import { FaCheck, FaCheckDouble, FaUser } from "react-icons/fa";
import { BiSolidDownArrow } from "react-icons/bi";
import ChatBackground from "@/assets/chatbackgroundResized.png";
import CustomerCareAgent4 from "@/assets/CustomerCareAgent4.jpg";
import LoadingAnimantion from "@/components/common/LoadingAnimantion";
import ChatToggle from "@/components/common/chat/ChatToggle";
import ChatInput from "./chat/ChatInput";
import UniversalButton from "@/components/common/UniversalButton";
import { IoMdClose } from "react-icons/io";
import Download from "../fileHandler/Download";
import ImageDisplay from "@/components/common/chat/ImageDisplay";
import {
  formatMessageTimestamp,
  formatMessagePreview,
  getUserStatus,
  ChatDocument,
  collections,
} from "@/lib/chat-functions";
import ChatDeleteButton from "./ChatDeleteButton";
import { DB_NAMES, FIREBASE_COLLECTIONS } from "@/lib/constants";
import {
  getAllChatDocumentsFromCache,
  storeChatDocumentsInCache,
  storeChatDocumentInCache,
  getChatMessagesFromCache,
  storeMessagesInCache,
  storeMessageInCache,
  deleteCompleteChatFromCache,
  getChatDatabaseMetadata,
  StoredChatDocument,
  StoredMessage,
} from "@/lib/admin-chat-cache";
import { UploadedFileInfo } from "@/types/globalTypes";
import { BsChatSquareTextFill } from "react-icons/bs";

export default function AdminChatWindow() {
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const [chats, setChats] = useState<StoredChatDocument[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<StoredChatDocument | null>(
    null
  );
  const [showChats, setShowChats] = useState(true);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  // Refs for managing listeners
  const chatDocListenersRef = useRef<Map<string, Unsubscribe>>(new Map());
  const messageListenerRef = useRef<Unsubscribe | null>(null);

  // Update chat document in Firebase and cache
  const updateChatDoc = async (
    chatToUpdate: StoredChatDocument,
    latestMessageText?: string
  ) => {
    const chatDocRef = doc(db, chatToUpdate.chatType, chatToUpdate.id);

    try {
      await updateDoc(chatDocRef, {
        latestMessage: latestMessageText || "",
        latestMessageTimestamp: Date.now(),
        messageCount: increment(+1),
        adminLastReadTimestamp: Date.now(),
        unreadUserMessageCount: 0,
        unreadAdminMessageCount: increment(+1),
      });

      const updatedChat: StoredChatDocument = {
        ...chatToUpdate,
        adminLastReadTimestamp: Date.now(),
        unreadUserMessageCount: 0,
        latestMessage: latestMessageText || chatToUpdate.latestMessage || "",
        latestMessageTimestamp: Date.now(),
        lastCacheUpdate: Date.now(),
      };

      // Update cache
      await storeChatDocumentInCache(updatedChat);

      setSelectedChat(updatedChat);
      setChats((prevChats) =>
        prevChats.map((c) => (c.id === chatToUpdate.id ? updatedChat : c))
      );
    } catch (err) {
      console.error("❌ Error updating chat document:", err);
      window.alert(
        "❌ Error updating chat document. Please close all open DevTools and check your internet connection and relaod the page to try again."
      );
    }
  };

  // Handle chat selection
  const handleChatClick = async (chat: StoredChatDocument) => {
    setSelectedChat(chat);
    setShowChats(false);
    setLoadingMessages(true);
    setError(null);

    // Clear existing message listener
    if (messageListenerRef.current) {
      messageListenerRef.current();
      messageListenerRef.current = null;
    }

    try {
      // Load cached messages first
      const cachedMessages = await getChatMessagesFromCache(chat.id);
      if (cachedMessages.length > 0) {
        setMessages(cachedMessages);
        setLoadingMessages(false);
      }

      // Check if we need to fetch new messages from Firebase
      const unreadCount =
        typeof chat.unreadUserMessageCount === "number"
          ? chat.unreadUserMessageCount
          : 0;

      if (unreadCount > 0) {
        await fetchNewMessages(chat, unreadCount);
      }

      // Setup message listener for real-time updates
      setupMessageListener(chat);

      // Mark chat as read
      const chatDocRef = doc(db, chat.chatType, chat.id);
      await updateDoc(chatDocRef, {
        unreadUserMessageCount: 0,
        adminLastReadTimestamp: Date.now(),
      });

      // Update local state and cache
      const updatedChat: StoredChatDocument = {
        ...chat,
        unreadUserMessageCount: 0,
        adminLastReadTimestamp: Date.now(),
        lastCacheUpdate: Date.now(),
      };

      await storeChatDocumentInCache(updatedChat);
      setSelectedChat(updatedChat);
      setChats((prevChats) =>
        prevChats.map((c) => (c.id === chat.id ? updatedChat : c))
      );
    } catch (error) {
      console.error("❌ Error handling chat click:", error);
      window.alert(
        "Failed to load messages. Please check your internet connection, then try again."
      );
    } finally {
      setLoadingMessages(false);
    }
  };

  // Fetch new messages from Firebase (limited to unread count)
  const fetchNewMessages = async (
    chat: StoredChatDocument,
    unreadCount: number
  ) => {
    const messagesRef = collection(
      db,
      `${chat.chatType}/${chat.id}/${FIREBASE_COLLECTIONS.CHAT_MESSAGES}`
    );

    const newMessagesQuery = query(
      messagesRef,
      where("timestamp", ">", chat.adminLastReadTimestamp || 0),
      orderBy("timestamp", "desc"),
      limit(unreadCount)
    );

    try {
      const newMessagesSnapshot = await getDocs(newMessagesQuery);
      const newMessages = newMessagesSnapshot.docs.map(
        (d) =>
          ({
            id: d.id,
            ...d.data(),
            chatId: chat.id,
            chatType: chat.chatType,
          } as StoredMessage)
      );

      if (newMessages.length > 0) {
        // Store new messages in cache
        await storeMessagesInCache(newMessages, chat.id, chat.chatType);
        // Get updated messages from cache and update state
        const updatedMessages = await getChatMessagesFromCache(chat.id);
        setMessages(updatedMessages);
      }
    } catch (error) {
      console.error("❌ Error fetching new messages:", error);
      window.alert(
        "Failed to fetch new messages. Please check your internet connection, then try again."
      );
    }
  };

  // Setup listener for new messages
  const setupMessageListener = (chat: StoredChatDocument) => {
    const messagesRef = collection(
      db,
      `${chat.chatType}/${chat.id}/${FIREBASE_COLLECTIONS.CHAT_MESSAGES}`
    );
    const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(
      messagesQuery,
      async (snapshot) => {
        try {
          const allMessages = snapshot.docs.map(
            (d) =>
              ({
                id: d.id,
                ...d.data(),
                chatId: chat.id,
                chatType: chat.chatType,
              } as StoredMessage)
          );

          // Update state immediately
          setMessages(allMessages);

          // Update cache in background
          await storeMessagesInCache(allMessages, chat.id, chat.chatType);
        } catch (error) {
          console.error("❌ Error in message listener:", error);
          window.alert("Failed to sync messages. Please refresh.");
        }
      },
      (error) => {
        console.error("❌ Message listener error:", error);
        window.alert("Connection lost. Please try again.");
        setLoadingMessages(false);
      }
    );

    messageListenerRef.current = unsubscribe;
  };

  // Handle going back to chat list
  const handleChatsToggle = () => {
    setShowChats(true);
    setSelectedChat(null);

    // Clear message listener
    if (messageListenerRef.current) {
      messageListenerRef.current();
      messageListenerRef.current = null;
    }
  };

  // Toggle chat window
  const toggleChat = () => {
    loadChats();
    setChatOpen(true);
  };

  // Load chats with caching strategy
  const loadChats = async () => {
    setLoadingChats(true);
    setError(null);

    try {
      // Step 1: Load from IndexedDB first
      const cachedChats = await getAllChatDocumentsFromCache();
      if (cachedChats.length > 0) {
        const sortedChats = sortChats(cachedChats);
        setChats(sortedChats);
        setLoadingChats(false);
      }

      // Step 2: Check for updates from Firebase
      const metadata = await getChatDatabaseMetadata();
      if (metadata.hasInitialData) {
        await checkForUpdates(metadata.lastFullSync);
      } else {
        await fetchAllChatsFromFirebase();
      }

      // Step 3: Setup real-time listeners
      await setupChatDocumentListeners();
    } catch (err) {
      console.error("Error loading chats:", err);
      window.alert(
        "❌ Failed to load chats. Please check your internet connection, then try again."
      );
    } finally {
      setLoadingChats(false);
    }
  };

  // Fetch all chats from Firebase (initial load)
  const fetchAllChatsFromFirebase = async () => {
    const allChats: StoredChatDocument[] = [];

    for (const coll of collections) {
      const chatsRef = collection(db, coll.name);
      const chatsQuery = query(
        chatsRef,
        orderBy("latestMessageTimestamp", "desc")
      );

      const snapshot = await getDocs(chatsQuery);

      for (const docSnap of snapshot.docs) {
        const chatData = docSnap.data();
        const chatDoc: StoredChatDocument = {
          id: docSnap.id,
          username: chatData.username || chatData.userName || docSnap.id,
          adminLastReadTimestamp: chatData.adminLastReadTimestamp || 0,
          userLastReadTimestamp: chatData.userLastReadTimestamp || 0,
          latestMessage: chatData.latestMessage || "",
          latestMessageTimestamp: chatData.latestMessageTimestamp || 0,
          messageCount: chatData.messageCount || 0,
          unreadAdminMessageCount: chatData.unreadAdminMessageCount || 0,
          unreadUserMessageCount: chatData.unreadUserMessageCount || 0,
          hasOnlyAdminMessage: chatData.hasOnlyAdminMessage || false,
          lastSeenOnline: chatData.lastSeenOnline || 0,
          userActive: chatData.userActive || false,
          chatType: coll.type,
          createdAt: chatData.createdAt || 0,
          lastCacheUpdate: Date.now(),
        };
        allChats.push(chatDoc);
      }
    }

    // Store all chats in cache
    if (allChats.length > 0) {
      await storeChatDocumentsInCache(allChats);
    }

    // Update state
    const sortedChats = sortChats(allChats);
    setChats(sortedChats);
  };

  // Check for updates since last sync
  const checkForUpdates = async (lastSyncTimestamp: number) => {
    let hasUpdates = false;
    const updatedChats: StoredChatDocument[] = [];

    for (const coll of collections) {
      const chatsRef = collection(db, coll.name);
      const updatedChatsQuery = query(
        chatsRef,
        where("latestMessageTimestamp", ">", lastSyncTimestamp),
        orderBy("latestMessageTimestamp", "desc")
      );

      const snapshot = await getDocs(updatedChatsQuery);
      if (snapshot.docs.length > 0) {
        hasUpdates = true;

        for (const docSnap of snapshot.docs) {
          const chatData = docSnap.data();
          const now = Date.now();
          const chatDoc: StoredChatDocument = {
            id: docSnap.id,
            username: chatData.username || chatData.userName || docSnap.id,
            adminLastReadTimestamp: chatData.adminLastReadTimestamp || 0,
            userLastReadTimestamp: chatData.userLastReadTimestamp || 0,
            latestMessage: chatData.latestMessage || "",
            latestMessageTimestamp: chatData.latestMessageTimestamp || 0,
            messageCount: chatData.messageCount || 0,
            unreadAdminMessageCount: chatData.unreadAdminMessageCount || 0,
            unreadUserMessageCount: chatData.unreadUserMessageCount || 0,
            hasOnlyAdminMessage: chatData.hasOnlyAdminMessage || false,
            lastSeenOnline: chatData.lastSeenOnline || 0,
            userActive: chatData.userActive || false,
            chatType: coll.type,
            createdAt: chatData.createdAt || 0,
            lastCacheUpdate: now,
          };
          updatedChats.push(chatDoc);
        }
      }
    }

    if (hasUpdates) {
      // Update cache with new data
      await storeChatDocumentsInCache(updatedChats);
      // Merge with existing chats
      setChats((prevChats) => {
        const mergedChats = [...prevChats];

        updatedChats.forEach((updatedChat) => {
          const existingIndex = mergedChats.findIndex(
            (c) => c.id === updatedChat.id
          );
          if (existingIndex >= 0) {
            mergedChats[existingIndex] = updatedChat;
          } else {
            mergedChats.push(updatedChat);
          }
        });

        return sortChats(mergedChats);
      });
    }
  };

  // Setup real-time listeners for all chat documents
  const setupChatDocumentListeners = async () => {
    // Clear existing listeners
    chatDocListenersRef.current.forEach((unsubscribe) => unsubscribe());
    chatDocListenersRef.current.clear();

    for (const coll of collections) {
      const chatsRef = collection(db, coll.name);
      const chatsQuery = query(
        chatsRef,
        orderBy("latestMessageTimestamp", "desc")
      );

      const unsubscribe = onSnapshot(chatsQuery, async (snapshot) => {
        const changedDocs = snapshot.docChanges();

        for (const change of changedDocs) {
          const chatData = change.doc.data();
          const now = Date.now();
          const chatDoc: StoredChatDocument = {
            id: change.doc.id,
            username: chatData.username || chatData.userName || change.doc.id,
            lastSeenOnline: chatData.lastSeenOnline,
            adminLastReadTimestamp: chatData.adminLastReadTimestamp || 0,
            userLastReadTimestamp: chatData.userLastReadTimestamp || 0,
            latestMessage: chatData.latestMessage || "",
            latestMessageTimestamp: chatData.latestMessageTimestamp || 0,
            messageCount: chatData.messageCount || 0,
            unreadAdminMessageCount: chatData.unreadAdminMessageCount || 0,
            unreadUserMessageCount: chatData.unreadUserMessageCount || 0,
            hasOnlyAdminMessage: chatData.hasOnlyAdminMessage || false,
            userActive: chatData.userActive || false,
            chatType: coll.type,
            createdAt: chatData.createdAt || 0,
            lastCacheUpdate: now,
          };

          if (change.type === "added" || change.type === "modified") {
            // Update cache
            await storeChatDocumentInCache(chatDoc);
            // Update state
            setChats((prevChats) => {
              const updatedChats = prevChats.filter((c) => c.id !== chatDoc.id);
              updatedChats.push(chatDoc);
              return sortChats(updatedChats);
            });

            // Update selected chat if it's the same
            if (selectedChat?.id === chatDoc.id) {
              setSelectedChat(chatDoc);
            }
          } else if (change.type === "removed") {
            // Remove from cache
            await deleteCompleteChatFromCache(chatDoc.id);
            // Update state
            setChats((prevChats) =>
              prevChats.filter((c) => c.id !== chatDoc.id)
            );
          }
        }
      });

      chatDocListenersRef.current.set(coll.name, unsubscribe);
    }
  };

  // Sort chats (hasOnlyAdminMessage at bottom)
  const sortChats = (chats: StoredChatDocument[]): StoredChatDocument[] => {
    return chats.sort((a, b) => {
      if (a.hasOnlyAdminMessage && !b.hasOnlyAdminMessage) return 1;
      if (!a.hasOnlyAdminMessage && b.hasOnlyAdminMessage) return -1;
      return b.latestMessageTimestamp - a.latestMessageTimestamp;
    });
  };

  // Calculate total unread count
  useEffect(() => {
    const total = chats.reduce(
      (sum, chat) =>
        sum +
        (typeof chat.unreadUserMessageCount === "number"
          ? chat.unreadUserMessageCount
          : 0),
      0
    );
    setTotalUnreadCount(total);
  }, [chats]);

  // Send message
  const sendMessage = async (messageData: {
    text: string;
    files?: Omit<UploadedFileInfo, "file">[];
  }) => {
    if (
      !messageData.text.trim() &&
      (!messageData.files || messageData.files.length === 0)
    )
      return;

    if (!selectedChat) {
      window.alert("❌ Cannot send message: no chat selected");
      return;
    }

    const messageToSend = {
      text: messageData.text,
      sender: "admin" as const,
      timestamp: Date.now(),
      ...(messageData.files &&
        messageData.files.length > 0 && {
          files: messageData.files,
        }),
    };

    const previewText = formatMessagePreview(
      messageData.text,
      messageData.files ? messageData.files.length : 0
    );

    try {
      // Add message to Firebase
      await addDoc(
        collection(db, `${selectedChat.chatType}/${selectedChat.id}/messages`),
        messageToSend
      );

      // Store message in cache
      const storedMessage: StoredMessage = {
        ...messageToSend,
        id: `temp-${Date.now()}`, // Temporary ID, will be replaced by Firebase
        chatId: selectedChat.id,
        chatType: selectedChat.chatType,
      };

      await storeMessageInCache(
        storedMessage,
        selectedChat.id,
        selectedChat.chatType
      );

      // Update chat document
      await updateChatDoc(selectedChat, previewText);

      // Clear the input
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      window.alert(
        "❌ Error sending message. Please check your internet connection then try again"
      );
    }
  };

  // Check if message is read
  const isMessageRead = (
    userLastReadTimestamp: number,
    messageTimestamp: number
  ): boolean => {
    return messageTimestamp <= userLastReadTimestamp;
  };

  // Cleanup listeners on unmount
  useEffect(() => {
    const chatDocListeners = chatDocListenersRef.current;
    const messageListener = messageListenerRef.current;

    return () => {
      chatDocListeners.forEach((unsubscribe) => unsubscribe());
      if (messageListener) {
        messageListener();
      }
    };
  }, []);

  // Handle chat window close
  const handleChatClose = () => {
    setChatOpen(false);
    setSelectedChat(null);
    setShowChats(true);

    // Clear message listener
    if (messageListenerRef.current) {
      messageListenerRef.current();
      messageListenerRef.current = null;
    }
  };

  const userStatusClassifier = (chat: ChatDocument) => {
    const userStatus = getUserStatus(
      chat.lastSeenOnline ?? 0,
      formatMessageTimestamp
    );
    return (
      <span className="font-medium text-gray-800 block truncate">
        {userStatus.isActive ? (
          <span className="text-green-500 text-xs">
            {userStatus.statusText}
          </span>
        ) : (
          <span className="text-gray-500 text-xs">{userStatus.statusText}</span>
        )}
      </span>
    );
  };

  if (error && !chatOpen) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h2 className="text-red-800 font-medium mb-2">Error</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      {chatOpen ? (
        <div className="fixed z-[100] bg-blue-100 top-2 bottom-10 max-[530px]:left-1 right-1 min-[530px]:right-3 w-[98vw] min-[530px]:w-[32rem] rounded-lg shadow-xl overflow-hidden">
          <div
            className="flex flex-col h-full"
            style={{
              backgroundImage: `url(${ChatBackground.src})`,
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="horizontal-space-between w-full bg-cyan-200 py-1 px-2">
              {selectedChat ? (
                <>
                  <div className="flex flex-col justify-start gap-1">
                    <div className="flex gap-1 items-center justify-center">
                      <div className="bg-white p-2 rounded-full">
                        <FaUser />
                      </div>
                      <div>
                        <p className="font-semibold text-xs">
                          {selectedChat.username}{" "}
                        </p>
                      </div>
                    </div>
                    {userStatusClassifier(selectedChat)}
                  </div>
                  <UniversalButton
                    onClick={handleChatsToggle}
                    icon={BsChatSquareTextFill}
                    color="green"
                    buttonClassName="!pr-2"
                    text="Chats"
                  />
                </>
              ) : (
                <>
                  {loadingChats ? (
                    <LoadingAnimantion
                      text="Loading Chats..."
                      className="justify-center items-center h-full w-full text-gray-500"
                    />
                  ) : (
                    <p className="font-semibold text-gray-500">
                      {chats.length} {chats.length === 1 ? "chat" : "chats"}{" "}
                      found
                    </p>
                  )}
                </>
              )}
              <UniversalButton
                icon={IoMdClose}
                onClick={handleChatClose}
                text="Close"
                buttonClassName="!pr-3 max-[400px]:hidden"
              />
              <button
                onClick={handleChatClose}
                className="min-[401px]:hidden rounded-md bg-gray-50 hover:bg-white p-1 sm:p-2 hover:scale-110 transition-all duration-500 cursor-pointer"
              >
                <IoMdClose size={20} />
              </button>
            </div>

            {error && showChats && (
              <div className="p-4 bg-red-50 border-b border-red-200 text-red-700">
                {error}
              </div>
            )}

            {showChats ? (
              loadingChats ? (
                <LoadingAnimantion
                  text="Loading Chats..."
                  className="flex-col justify-center items-center h-full w-full text-gray-500"
                />
              ) : (
                <div className="p-4 flex-1 overflow-y-auto chat-scrollbars">
                  {chats.length === 0 && !error ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">No active chats found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {chats.map((chat) => (
                        <div
                          key={chat.id}
                          className={`relative p-3 border rounded-lg transition duration-150 ${
                            typeof chat.unreadUserMessageCount === "number" &&
                            chat.unreadUserMessageCount > 0
                              ? "bg-blue-200 hover:bg-blue-300"
                              : "bg-gray-50 hover:bg-white"
                          }`}
                        >
                          <div
                            className="cursor-pointer"
                            onClick={() => handleChatClick(chat)}
                          >
                            <div className="flex justify-between items-start pr-8">
                              <div className="flex-grow min-w-0">
                                <div className="flex flex-col min-[530px]:flex-row gap-1 item-start">
                                  <span className="font-semibold text-gray-800">
                                    {chat.username}
                                  </span>{" "}
                                  <span>{userStatusClassifier(chat)}</span>
                                </div>
                                {chat.latestMessage && (
                                  <p className="text-sm text-gray-600 truncate mt-1">
                                    {chat.latestMessage}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col items-end ml-2 flex-shrink-0 my-auto">
                                {chat.latestMessageTimestamp && (
                                  <span className="text-xs text-gray-500 mb-1">
                                    {formatMessageTimestamp(
                                      chat.latestMessageTimestamp
                                    )}
                                  </span>
                                )}
                                {typeof chat.unreadUserMessageCount ===
                                  "number" &&
                                  chat.unreadUserMessageCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                                      {chat.unreadUserMessageCount}
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                          <ChatDeleteButton
                            chat={chat}
                            onChatDeleted={(chatId) => {
                              setChats((prevChats) =>
                                prevChats.filter((c) => c.id !== chatId)
                              );
                              if (selectedChat?.id === chatId) {
                                setSelectedChat(null);
                                setShowChats(true);
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            ) : (
              <>
                <div className="flex-1 flex flex-col-reverse overflow-y-auto overflow-x-hidden chat-scrollbars p-2">
                  {loadingMessages ? (
                    <LoadingAnimantion
                      text="Loading messages..."
                      className="flex-col justify-center items-center h-full w-full text-gray-500"
                    />
                  ) : (
                    <div className="flex flex-col space-y-2">
                      {messages.length > 0 ? (
                        <>
                          <div>
                            {" "}
                            {messages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex h-fit gap-2 ${
                                  message.sender === "admin"
                                    ? "flex-row-reverse justify-start"
                                    : "flex-row"
                                }`}
                              >
                                {message.sender === "admin" ? (
                                  <Image
                                    src={CustomerCareAgent4}
                                    alt="Customer care agent"
                                    className="rounded-img h-10 w-10 flex-shrink-0"
                                  />
                                ) : (
                                  <div className="bg-white p-2 h-fit w-fit rounded-[50%] flex-shrink-0">
                                    <FaUser size={22} />
                                  </div>
                                )}
                                <div
                                  className={`relative max-w-[75%] px-3 py-1 rounded-lg mb-5 ${
                                    message.sender === "admin"
                                      ? "bg-green-600 text-white"
                                      : "bg-blue-600 text-white"
                                  }`}
                                >
                                  {message.files &&
                                    message.files.length > 0 && (
                                      <div className="mb-2 space-y-3">
                                        {message.files.map((file, index) => {
                                          // Check if file is an image
                                          const isImage =
                                            /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(
                                              file.fileName
                                            );

                                          return (
                                            <div
                                              key={
                                                file.id || file.fileKey || index
                                              }
                                            >
                                              {isImage && (
                                                <ImageDisplay
                                                  fileKey={file.fileKey}
                                                  fileName={file.fileName}
                                                  dbName={
                                                    DB_NAMES.ADMIN_CHAT_FILES
                                                  }
                                                  className="mb-1"
                                                />
                                              )}
                                              <div className="flex items-center justify-between bg-white/10 rounded p-2 gap-1">
                                                <p className="text-xs truncate">
                                                  {file.fileName}
                                                </p>
                                                <Download
                                                  fileName={file.fileName}
                                                  fileKey={file.fileKey}
                                                  dbName={
                                                    DB_NAMES.ADMIN_CHAT_FILES
                                                  }
                                                  className="!p-1"
                                                />
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  <p className="text-sm whitespace-normal overflow-x-auto chat-scrollbars">
                                    {message.text}
                                  </p>
                                  <div
                                    className={`absolute flex gap-2 -bottom-4 text-nowrap text-xs mt-1 text-gray-700 w-fit ${
                                      message.sender === "admin"
                                        ? "text-right right-0"
                                        : "text-left left-0"
                                    }`}
                                  >
                                    <p>
                                      {formatMessageTimestamp(
                                        message.timestamp
                                      )}
                                    </p>
                                    {message.sender === "admin" &&
                                      (isMessageRead(
                                        selectedChat?.userLastReadTimestamp ??
                                          0,
                                        message.timestamp
                                      ) || selectedChat?.userActive ? (
                                        <FaCheckDouble className="text-gray-500" /> // User has read this admin message
                                      ) : (
                                        <FaCheck className="text-gray-500" /> // User hasn't read this admin message yet
                                      ))}
                                  </div>
                                  {message.sender === "admin" ? (
                                    <div className="absolute -top-1 -right-2 text-green-600">
                                      <BiSolidDownArrow size={19} />
                                    </div>
                                  ) : (
                                    <div className="absolute -top-1 -left-2 text-blue-600">
                                      <BiSolidDownArrow size={19} />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col text-center text-balance text-gray-600 italic gap-3 w-full h-full items-center justify-center">
                            <p>No messages yet.</p>
                            <p>
                              Please type your message below👇to start chatting
                              with the user.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
            {selectedChat && !showChats && (
              <ChatInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessage={sendMessage}
              />
            )}
          </div>
        </div>
      ) : (
        <div>
          <ChatToggle onClick={toggleChat} unreadCount={totalUnreadCount} />
        </div>
      )}
    </>
  );
}
