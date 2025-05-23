"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  doc, // Added
  updateDoc, // Added
} from "firebase/firestore";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import ChatBackground from "@/assests/chatbackgroundResized.png";
import CustomerCareAgent4 from "@/assests/CustomerCareAgent4.jpg";
import LoadingAnimantion from "@/components/common/LoadingAnimantion";
import ChatToggle from "@/components/common/chat/ChatToggle";
import ChatInput from "@/components/common/chat/ChatInput";
import ChatsButton from "./ChatsButtons";
import { UploadedFileInfo } from "@/types/fileData";
import FileDownloadButton from "@/components/common/FileDownloadButton";
import UniversalButton from "@/components/common/UniversalButton";
import { IoMdClose } from "react-icons/io";

const formatMessageTimestamp = (timestamp: number): string => {
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

interface ChatPreview {
  id: string;
  username: string;
  lastMessageText?: string;
  lastMessageTimestamp: number;
  unreadCount: number;
  adminLastReadTimestamp?: number; // Timestamp when admin last "cleared" unreads for this chat
  chatType: "registered" | "unregistered"; // To determine collection path easily
}

interface Message {
  id?: string;
  text: string;
  sender: "user" | "admin";
  timestamp: number;
  username: string;
  files?: UploadedFileInfo[];
}

const AdminChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);
  const [showChats, setShowChats] = useState(true);

  const isRegisteredUser = selectedChat
    ? selectedChat.chatType === "registered"
    : false;
  const chatId = selectedChat ? selectedChat.id : null;
  const currentUsername = selectedChat ? selectedChat.username : null;

  const handleChatClick = (chat: ChatPreview) => {
    const now = Date.now();

    setChats((prevChats) =>
      prevChats.map((c) =>
        c.id === chat.id
          ? { ...c, unreadCount: 0, adminLastReadTimestamp: now }
          : c
      )
    );
    setSelectedChat({ ...chat, unreadCount: 0, adminLastReadTimestamp: now });
    setShowChats(false);
    setLoadingMessages(true);

    const collectionPath =
      chat.chatType === "registered"
        ? "registeredUsersChats"
        : "unregisteredUsersChats";
    const chatDocRef = doc(db, collectionPath, chat.id);
    updateDoc(chatDocRef, { adminLastReadTimestamp: now }).catch((err) =>
      console.error("Error updating adminLastReadTimestamp on click:", err)
    );
  };

  const handleChatsToggle = () => {
    setShowChats(true);
    setSelectedChat(null);
    // Optionally, re-fetch chats if live updates are needed when returning to the list
    // fetchChats(); // Uncomment if you want the list to refresh counts when toggled.
  };

  const toggleChat = () => {
    setChatOpen(true);
    fetchChats();
  };

  async function fetchChats() {
    setLoadingChats(true);
    setError(null);
    try {
      const registeredChatsCol = collection(db, "registeredUsersChats");
      const unregisteredChatsCol = collection(db, "unregisteredUsersChats");

      const [registeredDocsSnap, unregisteredDocsSnap] = await Promise.all([
        getDocs(registeredChatsCol),
        getDocs(unregisteredChatsCol),
      ]);

      const allChatDocs = [
        ...registeredDocsSnap.docs.map((d) => ({
          id: d.id,
          data: d.data(),
          type: "registered" as const,
        })),
        ...unregisteredDocsSnap.docs.map((d) => ({
          id: d.id,
          data: d.data(),
          type: "unregistered" as const,
        })),
      ];

      const chatPreviewsPromises = allChatDocs.map(async (chatDoc) => {
        const chatCollectionPath =
          chatDoc.type === "registered"
            ? "registeredUsersChats"
            : "unregisteredUsersChats";
        const messagesRef = collection(
          db,
          `${chatCollectionPath}/${chatDoc.id}/messages`
        );

        const messagesQuery = query(messagesRef, orderBy("timestamp", "desc"));
        const messagesSnapshot = await getDocs(messagesQuery);

        const allMessagesForChat = messagesSnapshot.docs.map(
          (docSnapshot) => docSnapshot.data() as Omit<Message, "id">
        );

        if (allMessagesForChat.length === 0) {
          return null;
        }

        const lastMessage = allMessagesForChat[0];
        const firebaseAdminLastRead = chatDoc.data.adminLastReadTimestamp || 0;
        const unreadCount = allMessagesForChat.filter(
          (m) => m.sender === "user" && m.timestamp > firebaseAdminLastRead
        ).length;

        return {
          id: chatDoc.id,
          username:
            chatDoc.type === "registered" ? chatDoc.data.userName : chatDoc.id,
          lastMessageText:
            lastMessage.text ||
            (lastMessage.files && lastMessage.files.length > 0
              ? `${lastMessage.files.length} attachment(s)`
              : "Attachment(s)"),
          lastMessageTimestamp: lastMessage.timestamp,
          unreadCount: unreadCount,
          adminLastReadTimestamp: firebaseAdminLastRead,
          chatType: chatDoc.type,
        } as ChatPreview;
      });

      const resolvedPreviews = (await Promise.all(chatPreviewsPromises)).filter(
        (preview) => preview !== null
      ) as ChatPreview[];

      resolvedPreviews.sort(
        (a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp
      );

      setChats(resolvedPreviews);
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError("Failed to fetch chats. Please try again later.");
    } finally {
      setLoadingChats(false);
    }
  }

  useEffect(() => {
    if (!chatId || !selectedChat) {
      // Added !selectedChat check
      setMessages([]);
      setLoadingMessages(false);
      return;
    }

    const chatCollection =
      selectedChat.chatType === "registered"
        ? "registeredUsersChats"
        : "unregisteredUsersChats";

    const messagesRef = collection(db, `${chatCollection}/${chatId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    setLoadingMessages(true);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() } as Message)
        );
        setMessages(fetchedMessages);
        setLoadingMessages(false);

        // Mark messages as read by updating adminLastReadTimestamp because chat is open
        if (selectedChat) {
          const now = Date.now();
          const currentChatDocRef = doc(db, chatCollection, selectedChat.id);
          updateDoc(currentChatDocRef, { adminLastReadTimestamp: now })
            .then(() => {
              setSelectedChat((prev) =>
                prev ? { ...prev, adminLastReadTimestamp: now } : null
              );
              // Update the specific chat in the main list to ensure its unreadCount is 0
              setChats((prevChats) =>
                prevChats.map((c) =>
                  c.id === selectedChat.id
                    ? { ...c, unreadCount: 0, adminLastReadTimestamp: now }
                    : c
                )
              );
            })
            .catch((err) =>
              console.error(
                "Error auto-updating adminLastReadTimestamp for open chat:",
                err
              )
            );
        }
      },
      (err) => {
        console.error("Error fetching messages:", err);
        setLoadingMessages(false);
      }
    );

    return () => unsubscribe();
  }, [chatId, selectedChat]); // selectedChat dependency ensures effect reruns if type/id changes
  // and its properties are available for updateDoc logic.

  const sendMessage = async (messageData: {
    text: string;
    files?: Omit<UploadedFileInfo, "file">[];
  }) => {
    if (
      !messageData.text.trim() &&
      (!messageData.files || messageData.files.length === 0)
    )
      return;
    if (!chatId || !currentUsername || !selectedChat) {
      console.error("Cannot send message: chat/user context missing.");
      return;
    }

    const chatCollection =
      selectedChat.chatType === "registered"
        ? "registeredUsersChats"
        : "unregisteredUsersChats";

    const message: Message = {
      text: messageData.text,
      sender: "admin",
      timestamp: Date.now(),
      username: currentUsername,
      ...(messageData.files &&
        messageData.files.length > 0 && {
          files: messageData.files as UploadedFileInfo[],
        }),
    };

    try {
      await addDoc(
        collection(db, `${chatCollection}/${chatId}/messages`),
        message
      );
      // After sending a message, also update adminLastReadTimestamp for this chat
      const now = Date.now();
      const currentChatDocRef = doc(db, chatCollection, selectedChat.id);
      updateDoc(currentChatDocRef, { adminLastReadTimestamp: now })
        .then(() => {
          setSelectedChat((prev) =>
            prev ? { ...prev, adminLastReadTimestamp: now } : null
          );
          setChats((prevChats) =>
            prevChats.map((c) =>
              c.id === selectedChat.id
                ? { ...c, unreadCount: 0, adminLastReadTimestamp: now }
                : c
            )
          );
        })
        .catch((err) =>
          console.error(
            "Error updating adminLastReadTimestamp after send:",
            err
          )
        );
    } catch (error) {
      console.error("Error sending message:", error);
    }
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
        <div className="chat-container">
          <div
            className="flex flex-col h-[80vh]"
            style={{
              backgroundImage: `url(${ChatBackground.src})`,
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="horizontal-space-between w-full bg-blue-200 p-3">
              {selectedChat ? (
                <>
                  <div className="horizontal gap-2">
                    <div className="bg-white p-2 rounded-full">
                      <FaUser />
                    </div>
                    <div>
                      <p className="font-semibold">{currentUsername}</p>
                      <p className="text-sm text-gray-600">
                        {isRegisteredUser ? "Registered User" : "Guest User"}
                      </p>
                    </div>
                  </div>
                  <ChatsButton onClick={handleChatsToggle} />
                </>
              ) : (
                <>
                  <p className="font-semibold text-gray-500">
                    {loadingChats
                      ? "Loading chats..."
                      : `${chats.length} ${
                          chats.length === 1 ? "chat" : "chats"
                        } found`}
                  </p>
                </>
              )}
              <UniversalButton
                icon={IoMdClose}
                onClick={() => setChatOpen(false)}
                text="Close chat"
                buttonClassName="bg-blue-500 hover:bg-blue-700"
                iconClassName="bg-blue-400 group-hover:bg-blue-600"
              />
            </div>

            {error && showChats && (
              <div className="p-4 bg-red-50 border-b border-red-200 text-red-700">
                {error}
              </div>
            )}

            {showChats ? (
              loadingChats ? (
                <div className="vertical gap-4 h-32 flex-1 justify-center items-center">
                  <p>Loading Chats...</p>
                  <LoadingAnimantion />
                </div>
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
                          className={`block p-3 border rounded-lg transition duration-150 cursor-pointer ${
                            chat.unreadCount > 0
                              ? "bg-blue-100 hover:bg-blue-200"
                              : "bg-gray-100 hover:bg-gray-50"
                          }`}
                          onClick={() => handleChatClick(chat)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-grow min-w-0">
                              <span className="font-medium text-gray-800 block truncate">
                                {chat.username}
                              </span>
                              {chat.lastMessageText && (
                                <p className="text-sm text-gray-600 truncate mt-1">
                                  {chat.lastMessageText}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end ml-2 flex-shrink-0">
                              {chat.lastMessageTimestamp && (
                                <span className="text-xs text-gray-500 mb-1">
                                  {formatMessageTimestamp(
                                    chat.lastMessageTimestamp
                                  )}
                                </span>
                              )}
                              {chat.unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                                  {chat.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
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
                    <div className="vertical gap-4 h-full flex-1 justify-center items-center">
                      <p className="text-gray-500">Loading messages...</p>
                      <LoadingAnimantion />
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
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
                            className={`relative max-w-[75%] p-3 rounded-lg ${
                              message.sender === "admin"
                                ? "bg-green-600 text-white"
                                : "bg-blue-600 text-white"
                            }`}
                          >
                            {message.files && message.files.length > 0 && (
                              <div className="mb-2 space-y-1">
                                {message.files.map(
                                  (
                                    file,
                                    index // Added index as key fallback
                                  ) => (
                                    <div
                                      key={file.id || file.fileKey || index}
                                      className="flex items-center gap-2 bg-white/10 rounded p-2"
                                    >
                                      <span className="text-xs truncate flex-1">
                                        {file.fileName}
                                      </span>
                                      <FileDownloadButton
                                        fileName={file.fileName}
                                        fileKey={file.fileKey}
                                        className="!p-1"
                                      />
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                            <p className="text-sm whitespace-normal overflow-x-auto chat-scrollbars">
                              {message.text}
                            </p>
                            <p className="text-xs mt-1 opacity-75">
                              {formatMessageTimestamp(message.timestamp)}
                            </p>
                            {message.sender === "admin" ? (
                              <div className="chat-green-pointer" />
                            ) : (
                              <div className="chat-blue-pointer" />
                            )}
                          </div>
                        </div>
                      ))}
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
          <ChatToggle onClick={toggleChat} />
        </div>
      )}
    </>
  );
};

export default AdminChatWindow;
