"use client";

import React, { useState, useEffect, useCallback } from "react";
import { auth, db } from "@/lib/firebase";
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
} from "firebase/firestore";
import Image from "next/image";
import { getChatUserName } from "@/utils/initialize-chat";
import { FaUser } from "react-icons/fa";
import ChatBackground from "@/assests/chatbackgroundResized.png";
import CustomerCareAgent4 from "@/assests/CustomerCareAgent4.jpg";
import ChatToggle from "./chat/ChatToggle"; // Path to your ChatToggle component
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
  userName: string; // userName of the sender (user's name/ID or 'admin')
  files?: UploadedFileInfo[];
}

// Helper function for formatting message timestamps (copied from AdminChatWindow)
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

  // Function to check if user has ever sent a message and send welcome message if not
  const checkAndSendWelcomeMessage = async (
    collectionPath: string,
    docId: string
  ) => {
    try {
      const messagesRef = collection(db, `${collectionPath}/${docId}/messages`);
      const userMessagesQuery = query(
        messagesRef,
        where("sender", "==", "user")
      );
      const userMessagesSnapshot = await getDocs(userMessagesQuery);

      // If user has never sent a message, send welcome message
      if (userMessagesSnapshot.empty) {
        const welcomeMessage: Message = {
          text: "Hello, dear customer. I am Anne. Thank you for trusting Trademark Marketing Agency. Feel free to talk to us through this chat window whenever you need help or have questions. Thank you!",
          sender: "admin",
          timestamp: Date.now(),
          userName: "admin", // Admin's identifier
        };

        await addDoc(messagesRef, welcomeMessage);
        console.log("Welcome message sent to new user");
      }
    } catch (error) {
      console.error("Error checking/sending welcome message:", error);
    }
  };

  // Initialize userName and chatDocId
  useEffect(() => {
    let isMounted = true;
    const initializeUser = async () => {
      setIsInitializing(true);
      try {
        const name = await getChatUserName(); // This should return the user's name/ID
        if (isMounted) {
          setUserName(name);
          const currentUser = auth.currentUser;
          const collectionPath = currentUser
            ? "registeredUsersChats"
            : "unregisteredUsersChats";
          const docId = currentUser ? currentUser.uid : name; // `name` is guestId for guests
          setChatCollectionPath(collectionPath);
          setChatDocId(docId);

          // Check and send welcome message if needed
          await checkAndSendWelcomeMessage(collectionPath, docId);
        }
      } catch (error) {
        console.error("Error initializing chat user:", error);
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };
    initializeUser();
    return () => {
      isMounted = false;
    };
  }, []);

  // Effect for handling unread messages count when chat is closed
  useEffect(() => {
    if (isInitializing || !chatDocId || !chatCollectionPath || chatOpen) {
      if (!chatOpen) setUnreadAdminMessagesCount(0); // Clear count if becoming closed for other reasons
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const listenForUnreadMessages = async () => {
      const chatDocRef = doc(db, chatCollectionPath, chatDocId);
      const chatDocSnap = await getDoc(chatDocRef);
      // Ensure userLastReadTimestamp is initialized if not present
      if (
        chatDocSnap.exists() &&
        chatDocSnap.data()?.userLastReadTimestamp === undefined
      ) {
        await updateDoc(chatDocRef, { userLastReadTimestamp: 0 });
      } else if (!chatDocSnap.exists()) {
        // This case should ideally be handled by getChatUserName,
        // but as a fallback, we can create it.
        // Note: getChatUserName should be the primary source for document creation.
        await setDoc(chatDocRef, {
          userName: userName, // or specific logic from getChatUserName
          createdAt: serverTimestamp(),
          userLastReadTimestamp: 0,
        });
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

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          setUnreadAdminMessagesCount(snapshot.docs.length);
        },
        (error) => {
          console.error("Error listening for unread messages:", error);
        }
      );
    };

    listenForUnreadMessages();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isInitializing, chatDocId, chatCollectionPath, chatOpen, userName]); // Added userName

  // Effect for fetching messages when chat is open
  useEffect(() => {
    if (isInitializing || !chatDocId || !chatCollectionPath || !chatOpen) {
      setMessages([]); // Clear messages if chat is closed or not ready
      return;
    }

    const messagesRef = collection(
      db,
      `${chatCollectionPath}/${chatDocId}/messages`
    );
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() } as Message)
        );
        setMessages(fetchedMessages);
      },
      (error) => {
        console.error("Error fetching messages for open chat:", error);
      }
    );

    return () => unsubscribe();
  }, [isInitializing, chatDocId, chatCollectionPath, chatOpen]);

  const handleToggleChat = useCallback(async () => {
    if (isInitializing || !chatDocId || !chatCollectionPath) return;

    setChatOpen(true);
    setUnreadAdminMessagesCount(0); // Reset unread count immediately

    try {
      const chatDocRef = doc(db, chatCollectionPath, chatDocId);
      await updateDoc(chatDocRef, {
        userLastReadTimestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error updating userLastReadTimestamp:", error);
      // Handle case where doc might not exist, though getChatUserName should create it
      // For robustness, you could use setDoc with merge:true if updateDoc fails with "not-found"
      const chatDocRef = doc(db, chatCollectionPath, chatDocId);
      await setDoc(
        chatDocRef,
        { userLastReadTimestamp: Date.now() },
        { merge: true }
      );
    }
  }, [isInitializing, chatDocId, chatCollectionPath]);

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
      return;
    }

    const message: Message = {
      text: messageData.text,
      sender: "user",
      timestamp: Date.now(),
      userName: userName, // User's actual name or ID
      ...(messageData.files &&
        messageData.files.length > 0 && { files: messageData.files }),
    };

    try {
      await addDoc(
        collection(db, `${chatCollectionPath}/${chatDocId}/messages`),
        message
      );
      setNewMessage(""); // ChatInput should handle its own state if passed via props
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
            <div className="horizontal-space-between w-full bg-blue-200 p-3">
              <div className="horizontal gap-2">
                <div className="bg-white p-2 rounded-[50%]">
                  <FaUser />
                </div>
                <p className="font-semibold">{userName || "Loading..."}</p>
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
              </div>
            </div>
            <ChatInput
              newMessage={newMessage}
              setNewMessage={setNewMessage} // Assuming ChatInput needs setNewMessage
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
