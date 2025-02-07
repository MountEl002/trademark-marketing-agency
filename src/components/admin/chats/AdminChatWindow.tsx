"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";
import Image from "next/image";
import { IoClose, IoSend } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

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
    <div className="fixed z-[100] bg-white top-32 right-3 w-[32rem] rounded-lg shadow-xl overflow-hidden">
      <div className="flex flex-col h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center w-full bg-blue-200 p-3">
          <div className="flex items-center gap-2">
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
        <div className="flex-1 flex flex-col-reverse overflow-y-auto p-4 bg-gray-50">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">Loading messages...</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "admin" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-lg ${
                      message.sender === "admin"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.text}
                    </p>
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t p-3 bg-white">
          <div className="flex gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 resize-none border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
            <button
              onClick={sendMessage}
              className="px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <IoSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatWindow;
