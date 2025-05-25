"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import Image from "next/image";
import { getChatUserName } from "@/utils/initialize-chat";
import { FaUser } from "react-icons/fa";
import ChatBackground from "@/assests/chatbackgroundResized.png";
import CustomerCareAgent4 from "@/assests/CustomerCareAgent4.jpg";
import ChatToggle from "./chat/ChatToggle";
import ChatInput from "./chat/ChatInput";
import { UploadedFileInfo } from "@/types/fileData";
import FileDownloadButton from "./FileDownloadButton";
import UniversalButton from "./UniversalButton";
import { IoMdClose } from "react-icons/io";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id?: string;
  text: string;
  sender: "user" | "admin";
  timestamp: number;
  userName: string;
  files?: UploadedFileInfo[];
}

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

const Chat = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [chatOpen, setChatOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [unreadAdminMessagesCount, setUnreadAdminMessagesCount] = useState(0);
  const [chatDocId, setChatDocId] = useState<string | null>(null);
  const [chatCollectionPath, setChatCollectionPath] = useState<string | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user: authUser, username: authContextUsername } = useAuth();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const checkAndSendWelcomeMessage = async (
    collectionPath: string,
    docId: string
  ) => {
    if (!collectionPath || !docId) return;
    try {
      const messagesRef = collection(db, `${collectionPath}/${docId}/messages`);
      const q = query(messagesRef, limit(1));
      const messagesSnapshot = await getDocs(q);

      if (messagesSnapshot.empty) {
        const welcomeMessage: Message = {
          text: "Hello, dear customer. I am Anne. Thank you for trusting Trademark Marketing Agency. Feel free to talk to us through this chat window whenever you need help or have questions. Thank you!",
          sender: "admin",
          timestamp: Date.now(),
          userName: "admin",
        };
        await addDoc(messagesRef, welcomeMessage);
      }
    } catch (error) {
      console.error("Error checking/sending welcome message:", error);
    }
  };

  useEffect(() => {
    const initializeOrUpdateChatUser = async () => {
      setIsInitializing(true);
      setMessages([]);

      if (authUser) {
        const resolvedChatUsername =
          authContextUsername || (await getChatUserName());
        setUserName(resolvedChatUsername);
        setChatCollectionPath("registeredUsersChats");
        setChatDocId(authUser.uid);

        if (!authContextUsername) {
          console.error(
            "AuthContext username not yet available, relying on getChatUserName for name and doc creation."
          );
        } else {
          await getChatUserName();
        }
        await checkAndSendWelcomeMessage("registeredUsersChats", authUser.uid);
      } else {
        // User is unauthenticated
        console.error("AuthContext: User unauthenticated");
        const guestName = await getChatUserName();
        setUserName(guestName);
        setChatCollectionPath("unregisteredUsersChats");
        setChatDocId(guestName);
        await checkAndSendWelcomeMessage("unregisteredUsersChats", guestName);
      }
      setIsInitializing(false);
    };

    initializeOrUpdateChatUser();
  }, [authUser, authContextUsername]);

  useEffect(() => {
    if (isInitializing || !chatDocId || !chatCollectionPath || chatOpen) {
      if (chatOpen) setUnreadAdminMessagesCount(0);
      else if (!chatDocId && !isInitializing) setUnreadAdminMessagesCount(0);
      return;
    }

    let unsubscribeFromUnread: (() => void) | undefined;

    const listenForUnreadMessages = async () => {
      try {
        const chatDocRef = doc(db, chatCollectionPath, chatDocId);
        const chatDocSnap = await getDoc(chatDocRef);

        if (!chatDocSnap.exists()) {
          console.warn(
            `Chat document ${chatCollectionPath}/${chatDocId} does not exist. Cannot listen for unread messages.`
          );
          await setDoc(
            chatDocRef,
            {
              userName:
                userName ||
                (chatCollectionPath === "registeredUsersChats"
                  ? "RegisteredUser"
                  : "Guest"),
              createdAt: serverTimestamp(),
              userLastReadTimestamp: 0,
            },
            { merge: true }
          );
        }

        const userLastRead = chatDocSnap.data()?.userLastReadTimestamp || 0;

        const messagesRef = collection(
          db,
          `${chatCollectionPath}/${chatDocId}/messages`
        );
        const q = query(
          messagesRef,
          where("timestamp", ">", userLastRead),
          where("sender", "==", "admin")
        );

        unsubscribeFromUnread = onSnapshot(
          q,
          (snapshot) => {
            if (!chatOpen) {
              // Only update if chat is closed
              setUnreadAdminMessagesCount(snapshot.docs.length);
            }
          },
          (error) => {
            console.error("Error listening for unread messages:", error);
          }
        );
      } catch (error) {
        console.error("Error in listenForUnreadMessages setup:", error);
      }
    };

    listenForUnreadMessages();

    return () => {
      if (unsubscribeFromUnread) {
        unsubscribeFromUnread();
      }
    };
  }, [isInitializing, chatDocId, chatCollectionPath, chatOpen, userName]);

  // Effect for fetching messages when chat is open
  useEffect(() => {
    if (isInitializing || !chatDocId || !chatCollectionPath || !chatOpen) {
      if (!chatOpen) setMessages([]); // Clear messages if chat is closed or not ready
      return;
    }

    const messagesRef = collection(
      db,
      `${chatCollectionPath}/${chatDocId}/messages`
    );
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribeFromMessages = onSnapshot(
      q,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() } as Message)
        );
        setMessages(fetchedMessages);
      },
      (error) => {
        console.error("Error fetching messages for open chat:", error);
        setMessages([]); // Clear messages on error
      }
    );

    return () => unsubscribeFromMessages();
  }, [isInitializing, chatDocId, chatCollectionPath, chatOpen]);

  const handleToggleChat = useCallback(async () => {
    if (isInitializing || !chatDocId || !chatCollectionPath) {
      console.warn("Cannot open chat: chat not fully initialized.");
      return;
    }

    setChatOpen(true);
    setUnreadAdminMessagesCount(0);

    try {
      const chatDocRef = doc(db, chatCollectionPath, chatDocId);
      // Ensure the document exists before trying to update it.
      // getChatUserName should have created it. If not, setDoc with merge.
      const docSnap = await getDoc(chatDocRef);
      if (docSnap.exists()) {
        await updateDoc(chatDocRef, {
          userLastReadTimestamp: Date.now(),
        });
      } else {
        // This case should ideally be rare if getChatUserName works correctly.
        await setDoc(
          chatDocRef,
          {
            userName: userName, // Or derive from auth state again
            createdAt: serverTimestamp(),
            userLastReadTimestamp: Date.now(),
          },
          { merge: true }
        );
        console.log("Chat document created on toggle (was missing).");
      }
    } catch (error) {
      console.error("Error updating userLastReadTimestamp:", error);
      // Fallback for robustness, though ideally not needed if above logic is sound.
      try {
        const chatDocRef = doc(db, chatCollectionPath, chatDocId);
        await setDoc(
          chatDocRef,
          { userLastReadTimestamp: Date.now() },
          { merge: true }
        );
      } catch (setError) {
        console.error(
          "Error setting userLastReadTimestamp with merge:",
          setError
        );
      }
    }
  }, [isInitializing, chatDocId, chatCollectionPath, userName]); // Added userName

  const handleCloseChat = () => {
    setChatOpen(false);
  };

  const sendMessage = async (messageData: {
    text: string;
    files?: UploadedFileInfo[];
  }) => {
    if (
      (!messageData.text.trim() &&
        (!messageData.files || messageData.files.length === 0)) ||
      !chatDocId ||
      !chatCollectionPath ||
      !userName
    ) {
      console.warn("Cannot send message: missing data", {
        chatDocId,
        chatCollectionPath,
        userName,
        messageData,
      });
      return;
    }

    const message: Message = {
      text: messageData.text,
      sender: "user",
      timestamp: Date.now(),
      userName: userName,
      ...(messageData.files &&
        messageData.files.length > 0 && { files: messageData.files }),
    };

    try {
      await addDoc(
        collection(db, `${chatCollectionPath}/${chatDocId}/messages`),
        message
      );
      // setNewMessage(""); // ChatInput handles its own state.
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (isInitializing && !chatDocId) {
    // Show a more generic loading state until chatDocId is resolved
    return (
      <div>
        <ChatToggle onClick={() => {}} unreadCount={0} />
        {/* Optionally, a small loading indicator instead of the full chat window if trying to open */}
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
              <div className="horizontal gap-2">
                <div className="bg-white p-2 rounded-[50%]">
                  <FaUser />
                </div>
                <p className="font-semibold">
                  {isInitializing ? "Loading..." : userName || "User"}
                </p>
              </div>
              <UniversalButton
                icon={IoMdClose}
                onClick={handleCloseChat}
                text="Close chat"
                buttonClassName="bg-blue-500 hover:bg-blue-700"
                iconClassName="bg-blue-400 group-hover:bg-blue-600"
              />
            </div>

            <div className="flex-1 flex flex-col-reverse overflow-y-auto overflow-x-hidden chat-scrollbars p-2 mr-1">
              {/* This div is for the messages content, and an empty div at the bottom for scrolling */}
              <div>
                {messages.map((message) => (
                  <div
                    key={message.id || message.timestamp} // Ensure key is unique
                    className={`flex ${
                      message.sender === "admin"
                        ? "flex-row"
                        : "flex-row-reverse justify-start"
                    } h-fit gap-2 mb-2`} // Added mb-2 for spacing
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
                      {message.files && message.files.length > 0 && (
                        <div className="mb-2 space-y-1">
                          {message.files.map((file, index) => (
                            <div
                              key={file.id || file.fileKey || index}
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
                        {formatMessageTimestamp(message.timestamp)}
                      </p>
                      {message.sender === "admin" ? (
                        <div className="chat-blue-pointer" />
                      ) : (
                        <div className="chat-green-pointer" />
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} /> {/* Element to scroll to */}
              </div>
            </div>
            <ChatInput
              newMessage={newMessage} // ChatInput should manage its own input state
              setNewMessage={setNewMessage}
              sendMessage={sendMessage}
            />
          </div>
        </div>
      ) : (
        <div>
          <ChatToggle
            onClick={handleToggleChat}
            unreadCount={unreadAdminMessagesCount}
          />
        </div>
      )}
    </>
  );
};

export default Chat;
