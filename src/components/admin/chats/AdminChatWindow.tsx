"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import Image from "next/image";
import { IoClose, IoSend } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import ChatBackground from "@/assests/chatbackgroundResized.png";
import CustomerCareAgent4 from "@/assests/CustomerCareAgent4.jpg";
import LoadingAnimantion from "@/components/common/LoadingAnimantion";
import { GrAttachment } from "react-icons/gr";

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
  onClose: () => void;
}

const AdminChatWindow = ({
  chatId,
  userNumber,
  isRegisteredUser,
  onClose,
}: AdminChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed z-[100] bg-white top-4 right-3 w-[35rem] rounded-lg shadow-xl overflow-hidden">
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
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-300 rounded-full transition-colors"
          >
            <IoClose size={24} />
          </button>
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
                      <div className="absolute right-[-8px] top-3 h-0 w-0 border-t-[8px] border-t-transparent border-l-[8px] border-l-green-600 border-b-[8px] border-b-transparent" />
                    ) : (
                      <div className="absolute left-[-8px] top-3 h-0 w-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-blue-600 border-b-[8px] border-b-transparent" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="horizontal-start w-full h-20 bg-gray-100 p-1">
          <div className="w-[90%] h-full border border-blue-500 rounded-lg p-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="w-full h-full p-2 bg-transparent outline-none resize-none chat-scrollbars text-sm whitespace-normal overflow-x-auto"
            />
          </div>
          <div className="vertical gap-1 w-[10%] h-full bg-transparent">
            <div className="group bg-transparent hover:bg-blue-600 rounded-[50%] transition-all duration-500 p-2">
              <GrAttachment className="text-blue-600 group-hover:text-white transition-all duration-500" />
            </div>
            <button
              onClick={sendMessage}
              className="group bg-transparent hover:bg-blue-600 rounded-[50%] transition-all duration-500 p-2"
            >
              <IoSend className="text-blue-600 group-hover:text-white transition-all duration-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatWindow;
