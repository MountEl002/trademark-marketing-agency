"use client";

import React, { useState } from "react";
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
import { FaUser } from "react-icons/fa";
import ChatBackground from "@/assests/chatbackgroundResized.png";
import CustomerCareAgent4 from "@/assests/CustomerCareAgent4.jpg";
import ChatToggle from "./chat/ChatToggle";
import ChatInput from "./chat/ChatInput";
import { UploadedFileInfo } from "@/types/fileData";
import FileDownloadButton from "./FileDownloadButton";
import UniversalButton from "./UniversalButton";
import { IoMdClose } from "react-icons/io";

interface Message {
  id?: string;
  text: string;
  sender: "user" | "admin";
  timestamp: number;
  userNumber: string;
  files?: UploadedFileInfo[];
}

const Chat = () => {
  const [userNumber, setUserNumber] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isInitializing, setIsInitializing] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  const toggleChat = () => {
    setChatOpen(true);

    let isMounted = true;
    let messageCleanup: (() => void) | undefined;

    // Initialize chat user number
    const initializeChat = async () => {
      try {
        if (!userNumber && isInitializing) {
          const number = await getChatUserNumber();
          if (isMounted) {
            setUserNumber(number);
            setIsInitializing(false);
            setupMessageListener(number);
          }
        } else if (userNumber) {
          setupMessageListener(userNumber);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    // Setup message listener
    const setupMessageListener = async (currentUserNumber: string) => {
      const currentUser = auth.currentUser;
      const chatCollection = currentUser
        ? "registeredUsersChats"
        : "unregisteredUsersChats";
      const chatDocId = currentUser ? currentUser.uid : currentUserNumber;

      const messagesRef = collection(
        db,
        `${chatCollection}/${chatDocId}/messages`
      );

      const q = query(messagesRef, orderBy("timestamp", "asc"));

      messageCleanup = onSnapshot(q, (snapshot) => {
        if (!isMounted) return;

        const fetchedMessages = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Message)
        );

        setMessages(fetchedMessages);
      });
    };

    initializeChat();

    return () => {
      isMounted = false;
      if (messageCleanup) {
        messageCleanup();
      }
    };
  };
  // Send message function
  const sendMessage = async (messageData: {
    text: string;
    files?: UploadedFileInfo[];
  }) => {
    if (
      !messageData.text.trim() &&
      (!messageData.files || messageData.files.length === 0)
    )
      return;

    const currentUser = auth.currentUser;
    const chatCollection = currentUser
      ? "registeredUsersChats"
      : "unregisteredUsersChats";
    const chatDocId = currentUser ? currentUser.uid : userNumber;

    const message: Message = {
      text: messageData.text,
      sender: "user",
      timestamp: Date.now(),
      userNumber: userNumber as string,
      ...(messageData.files &&
        messageData.files.length > 0 && { files: messageData.files }),
    };

    try {
      await addDoc(
        collection(db, `${chatCollection}/${chatDocId}/messages`),
        message
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
            className="flex flex-col h-[80vh]"
            style={{
              backgroundImage: `url(${ChatBackground.src})`,
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Header*/}
            <div className="horizontal-space-between w-full bg-blue-200 p-3">
              <div className="horizontal gap-2">
                <div className="bg-white p-2 rounded-[50%]">
                  <FaUser />
                </div>
                <p className="font-semibold">
                  Customer {userNumber || "Loading..."}
                </p>
              </div>
              <UniversalButton
                icon={IoMdClose}
                onClick={() => setChatOpen(false)}
                text="Close chat"
                buttonClassName="bg-blue-500 hover:bg-blue-700"
                iconClassName="bg-blue-400 group-hover:bg-blue-600"
              />
            </div>

            {/* Messages container */}
            <div className="flex-1 flex flex-col-reverse overflow-y-auto overflow-x-hidden chat-scrollbars p-2 mr-1">
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
                      {/* Render files if present */}
                      {message.files && message.files.length > 0 && (
                        <div className="mb-2 space-y-1">
                          {message.files.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center gap-2 bg-white/10 rounded p-1"
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
                        <div className="chat-blue-pointer" />
                      ) : (
                        <div className="chat-green-pointer" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input area - fixed height */}
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

export default Chat;
