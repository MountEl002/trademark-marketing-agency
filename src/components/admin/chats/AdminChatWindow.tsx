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
} from "firebase/firestore";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import ChatBackground from "@/assests/chatbackgroundResized.png";
import CustomerCareAgent4 from "@/assests/CustomerCareAgent4.jpg";
import LoadingAnimantion from "@/components/common/LoadingAnimantion";
import ChatToggle from "@/components/common/chat/ChatToggle";
import ChatInput from "@/components/common/chat/ChatInput";
import CloseButton from "@/components/common/CloseButton";
import ChatsButton from "./ChatsButtons";
import { UploadedFileInfo } from "@/types/order";
import FileDownloadButton from "@/components/common/FileDownloadButton";

interface ChatPreview {
  id: string;
  userNumber: string;
  lastMessage?: string;
  createdAt: number;
}

interface Message {
  id?: string;
  text: string;
  sender: "user" | "admin";
  timestamp: number;
  userNumber: string;
  files?: UploadedFileInfo[];
}

const AdminChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);
  const [showChats, setShowChats] = useState(true);

  const isRegisteredUser = selectedChat ? selectedChat.id.length > 10 : false;
  const chatId = selectedChat ? selectedChat.id : null;
  const userNumber = selectedChat ? selectedChat.userNumber : null;

  const handleChatClick = (chat: ChatPreview) => {
    setSelectedChat(chat);
    setShowChats(false);
  };

  const handleChatsToggle = () => {
    setShowChats(true);
    setSelectedChat(null);
  };

  const toggleChat = () => {
    setChatOpen(true);

    async function fetchChats() {
      try {
        const registeredChats = collection(db, "registeredUsersChats");
        const unregisteredChats = collection(db, "unregisteredUsersChats");

        // Fetch both registered and unregistered chats
        const [registeredDocs, unregisteredDocs] = await Promise.all([
          getDocs(query(registeredChats, orderBy("createdAt", "desc"))),
          getDocs(query(unregisteredChats, orderBy("createdAt", "desc"))),
        ]);

        // Process and combine the chats
        const combinedChats: ChatPreview[] = [
          ...registeredDocs.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
                userNumber: doc.data().userNumber, // For registered users, use doc ID as user number
              } as ChatPreview)
          ),
          ...unregisteredDocs.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
                userNumber: doc.id, // For unregistered users, doc ID is the user number
              } as ChatPreview)
          ),
        ].sort((a, b) => b.createdAt - a.createdAt);

        setChats(combinedChats);
        setError(null);
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError("Failed to fetch chats. Please try again later.");
      } finally {
        setLoadingChats(false);
      }
    }

    fetchChats();
  };

  useEffect(() => {
    const chatCollection = isRegisteredUser
      ? "registeredUsersChats"
      : "unregisteredUsersChats";

    const messagesRef = collection(db, `${chatCollection}/${chatId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Message)
      );
      setMessages(fetchedMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId, isRegisteredUser]);

  const sendMessage = async (messageData: {
    text: string;
    files?: UploadedFileInfo[];
  }) => {
    if (
      !newMessage.trim() &&
      (!messageData.files || messageData.files.length === 0)
    )
      return;

    const chatCollection = isRegisteredUser
      ? "registeredUsersChats"
      : "unregisteredUsersChats";

    const message: Message = {
      text: messageData.text,
      sender: "admin",
      timestamp: Date.now(),
      userNumber: userNumber || "unknown",
      ...(messageData.files &&
        messageData.files.length > 0 && { files: messageData.files }),
    };

    try {
      await addDoc(
        collection(db, `${chatCollection}/${chatId}/messages`),
        message
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (error) {
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
            {/* Header */}
            <div className="horizontal-space-between w-full bg-blue-200 p-3">
              {selectedChat ? (
                <>
                  <div className="horizontal gap-2">
                    <div className="bg-white p-2 rounded-full">
                      <FaUser />
                    </div>
                    <div>
                      <p className="font-semibold">User {userNumber}</p>
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
                    {chats.length} {chats.length === 1 ? "chat " : "chats "}
                    found
                  </p>
                </>
              )}
              <CloseButton name="Close" onClick={() => setChatOpen(false)} />
            </div>
            {showChats ? (
              loadingChats ? (
                <div className="vertical gap-4 h-32">
                  <p>Loading Chats...</p>
                  <LoadingAnimantion />
                </div>
              ) : (
                <>
                  <div className="p-4 flex-1 overflow-y-auto chat-scrollbars">
                    {chats.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">No chats found</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {chats.map((chat) => (
                          <div
                            key={chat.id}
                            className="block p-2 border rounded-lg bg-gray-100 hover:bg-gray-50 transition duration-150 cursor-pointer"
                            onClick={() => handleChatClick(chat)}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">
                                User {chat.userNumber}
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(chat.createdAt).toLocaleString()}
                              </span>
                            </div>
                            {chat.lastMessage && (
                              <p className="text-sm text-gray-600 truncate mt-1">
                                {chat.lastMessage}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )
            ) : (
              <>
                {/* Messages container */}
                <div className="flex-1 flex flex-col-reverse overflow-y-auto overflow-x-hidden chat-scrollbars p-2">
                  {loading ? (
                    <div className="vertical gap-4 h-full">
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
                            {/* Render files if present */}
                            {message.files && message.files.length > 0 && (
                              <div className="mb-2 space-y-1">
                                {message.files.map((file) => (
                                  <div
                                    key={file.id}
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
                                ))}
                              </div>
                            )}
                            <p className="text-sm whitespace-normal overflow-x-auto chat-scrollbars">
                              {message.text}
                            </p>
                            <p className="text-xs mt-1 opacity-75">
                              {new Date(message.timestamp).toLocaleTimeString()}
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
            {/* Input area */}
            {selectedChat && (
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
