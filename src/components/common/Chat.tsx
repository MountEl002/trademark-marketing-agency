"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import Image from "next/image";
import { getChatUserNumber } from "@/utils/initialize-chat";
import { IoClose, IoSend } from "react-icons/io5";
import { GrAttachment } from "react-icons/gr";
import { FaUser } from "react-icons/fa";
import ChatBackground from "@/assests/chatbackgroundResized.png";
import CustomerCareAgent4 from "@/assests/CustomerCareAgent4.jpg";

interface Message {
  id?: string;
  text: string;
  sender: "user" | "admin";
  timestamp: number;
  userNumber: string;
}

const Chat = () => {
  const [userNumber, setUserNumber] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    // Initialize chat user number
    const initializeChat = async () => {
      try {
        const number = await getChatUserNumber();
        setUserNumber(number);
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };

    // If user number is set, fetch messages
    const fetchMessages = async (chatUserNumber: string) => {
      const currentUser = auth.currentUser;
      const chatCollection = currentUser
        ? "registeredUsersChats"
        : "unregisteredUsersChats";

      // For registered users, use the UID as the document ID
      const chatDocId = currentUser ? currentUser.uid : chatUserNumber;

      const messagesRef = collection(
        db,
        `${chatCollection}/${chatDocId}/messages`
      );

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
      });

      return () => unsubscribe();
    };

    // Initialize chat first
    initializeChat();

    // If user number is set, fetch messages
    let cleanupFn: (() => void) | undefined;
    if (userNumber) {
      fetchMessages(userNumber).then((cleanup) => {
        cleanupFn = cleanup;
      });
    }

    // Cleanup function
    return () => {
      if (cleanupFn) cleanupFn();
    };
  }, [userNumber]);

  // Send message function
  const sendMessage = async () => {
    if (!newMessage.trim() || !userNumber) return;

    const currentUser = auth.currentUser;
    const chatCollection = currentUser
      ? "registeredUsersChats"
      : "unregisteredUsersChats";

    // Use UID for registered users, userNumber for unregistered
    const chatDocId = currentUser ? currentUser.uid : userNumber;

    const messageData: Message = {
      text: newMessage,
      sender: currentUser ? "user" : "user", // or 'admin' if sent by admin
      timestamp: Date.now(),
      userNumber: userNumber,
    };

    try {
      await addDoc(
        collection(db, `${chatCollection}/${chatDocId}/messages`),
        messageData
      );

      // Clear input after sending
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="fixed z-[100] bg-blue-100 top-32 right-3 w-[32rem] rounded-lg shadow-xl overflow-hidden">
      <div
        className="flex flex-col h-[80vh]"
        style={{
          backgroundImage: `url(${ChatBackground.src})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Header - fixed height */}
        <div className="horizontal-space-between w-full bg-blue-200 p-3">
          <div className="horizontal gap-2">
            <div className="bg-white p-2 rounded-[50%]">
              <FaUser />
            </div>
            <p className="font-semibold">
              Customer {userNumber || "Loading..."}
            </p>
          </div>
          <IoClose size={30} />
        </div>

        {/* Messages container */}
        <div className="flex-1 flex flex-col-reverse overflow-y-auto overflow-x-hidden chat-scrollbars p-2">
          <div className="flex flex-col space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "admin"
                    ? "flex-row"
                    : "flex-row-reverse justify-start"
                } h-fit gap-2`}
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
                  className={`relative max-w-[75%] p-2 rounded-lg ${
                    message.sender === "admin"
                      ? "bg-blue-600 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  <p className="text-sm whitespace-normal overflow-x-auto chat-scrollbars">
                    {message.text}
                  </p>
                  {message.sender === "admin" ? (
                    <div className="absolute left-[-8px] top-3 h-0 w-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-blue-600 border-b-[8px] border-b-transparent" />
                  ) : (
                    <div className="absolute right-[-8px] top-3 h-0 w-0 border-t-[8px] border-t-transparent border-l-[8px] border-l-green-600 border-b-[8px] border-b-transparent" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input area - fixed height */}
        <div className="horizontal-start w-full h-20 bg-gray-100 p-1">
          <div className="w-[90%] h-full border border-blue-500 rounded-lg p-1">
            <textarea
              name="message"
              id="message"
              placeholder="Message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
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

export default Chat;
