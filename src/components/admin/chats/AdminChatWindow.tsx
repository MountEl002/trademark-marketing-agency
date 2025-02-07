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
}

interface AdminChatWindowProps {
  chatId: string;
  userNumber: string;
  isRegisteredUser: boolean;
}

const AdminChatWindow = ({
  chatId,
  userNumber,
  isRegisteredUser,
}: AdminChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  const toggleChat = () => {
    setChatOpen(true);
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

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const chatCollection = isRegisteredUser
      ? "registeredUsersChats"
      : "unregisteredUsersChats";

    const messageData: Message = {
      text: newMessage,
      sender: "admin",
      timestamp: Date.now(),
      userNumber: userNumber,
    };

    try {
      await addDoc(
        collection(db, `${chatCollection}/${chatId}/messages`),
        messageData
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      {chatOpen ? (
        <div className="chat-container">
          <div
            className="flex flex-col h-[95vh]"
            style={{
              backgroundImage: `url(${ChatBackground.src})`,
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Header */}
            <div className="horizontal-space-between w-full bg-blue-200 p-3">
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
              <CloseButton
                name="Close chat"
                onClick={() => setChatOpen(false)}
              />
            </div>

            {/* Messages container */}
            <div className="flex-1 flex flex-col-reverse overflow-y-auto overflow-x-hidden chat-scrollbars p-2">
              {loading ? (
                <div className="flex justify-center items-center h-full">
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
            {/* Input area */}
            <ChatInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              sendMessage={sendMessage}
            />
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
