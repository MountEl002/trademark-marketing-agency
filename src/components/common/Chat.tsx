"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  where,
  getDocs,
  limit,
  increment,
} from "firebase/firestore";
import Image from "next/image";
import { classifyUser } from "@/utils/initialize-chat";
import { FaUser } from "react-icons/fa";
import ChatBackground from "@/assets/chatbackgroundResized.png";
import CustomerCareAgent4 from "@/assets/CustomerCareAgent4.jpg";
import ChatToggle from "./chat/ChatToggle";
import ChatInput from "./chat/ChatInput";
import Download from "../fileHandler/Download";
import UniversalButton from "./UniversalButton";
import { IoMdClose } from "react-icons/io";
import { useAuth } from "@/contexts/AuthContext";
import ImageDisplay from "./chat/ImageDisplay";
import {
  formatMessageTimestamp,
  getCachedChatMessages,
  cacheChatMessages,
  Message,
  removeCachedChat,
  formatMessagePreview,
  typedUpdateChatDoc,
  getCacheDbNames,
} from "@/lib/chat-functions";
import {
  registerChatActions,
  unregisterChatActions,
} from "@/hooks/useGlobalChat";
import { deleteIndexedDatabase } from "@/utils/client-indexeddb";
import LoadingAnimantion from "./LoadingAnimantion";
import { BiSolidDownArrow } from "react-icons/bi";
import { ChatType, FIREBASE_COLLECTIONS } from "@/lib/constants";
import { UploadedFileInfo } from "@/types/globalTypes";

export default function Chat() {
  const [username, setUsername] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [chatOpen, setChatOpen] = useState(false);
  const [closingChat, setClosingChat] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [unreadAdminMessagesCount, setUnreadAdminMessagesCount] = useState(0);
  const [chatDocId, setChatDocId] = useState<string | null>(null);
  const [chatCollectionPath, setChatCollectionPath] = useState<ChatType | null>(
    null
  );
  const [fileDbOfCurrentUser, setFileDbOfCurrentUser] = useState<string>("");
  const [systemGeneratedMessage, setSystemGeneratedMessage] =
    useState<string>("");
  const [sGMSender, setSGMSender] = useState<"user" | "admin">("user");
  const [isProcessingSystemMessage, setIsProcessingSystemMessage] =
    useState(false);

  useEffect(() => {
    const userLastSeenOnline = async (chatCollectionPath: string) => {
      const collectionPath = chatCollectionPath;

      if (!collectionPath || !chatDocId) {
        throw new Error("collectionPath and chatDocId must be non-null");
      }
      const chatDocRef = doc(db, collectionPath, chatDocId);

      try {
        await typedUpdateChatDoc(chatDocRef, {
          lastSeenOnline: Date.now(),
        });
      } catch (err) {
        console.error("Error updating user's last time seen online:", err);
      }
    };

    const intervalId = setInterval(() => {
      if (chatCollectionPath) {
        userLastSeenOnline(chatCollectionPath);
      }
    }, 120 * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [chatCollectionPath, chatDocId]);

  const updateChatDoc = async (
    chatCollectionPath: string,
    latestMessageText: string
  ) => {
    const collectionPath = chatCollectionPath;

    if (!collectionPath || !chatDocId) {
      throw new Error("collectionPath and chatDocId must be non-null");
    }
    const chatDocRef = doc(db, collectionPath, chatDocId);

    try {
      await typedUpdateChatDoc(chatDocRef, {
        latestMessage: latestMessageText,
        latestMessageTimestamp: Date.now(),
        messageCount: increment(+1),
        userLastReadTimestamp: Date.now(),
        unreadAdminMessageCount: 0,
        unreadUserMessageCount: increment(+1),
        hasOnlyAdminMessage: false,
        lastSeenOnline: Date.now(),
      });
    } catch (err) {
      console.error("Error updating user's chatDocument:", err);
    }
  };

  // Track if we've ever seen messages for this chat
  const hasSeenMessages = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user: authUser, userData } = useAuth();
  const authContextUsername = userData?.username;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const initializationRef = useRef(false);

  const initializeChat = useCallback(async () => {
    if (initializationRef.current) return;
    initializationRef.current = true;
    setIsInitializing(true);
    setMessages([]);

    const checkAndSendWelcomeMessage = async (
      collectionPath: ChatType,
      docId: string,
      classifiedUserNumber: string
    ) => {
      if (!collectionPath || !docId) return;
      try {
        const messagesRef = collection(
          db,
          `${collectionPath}/${docId}/${FIREBASE_COLLECTIONS.CHAT_MESSAGES}`
        );

        const { messagesDb, filesDb } = getCacheDbNames(collectionPath);

        const chatDocRef = doc(db, collectionPath, docId);
        const q = query(messagesRef, limit(1));
        const messagesSnapshot = await getDocs(q);

        if (messagesSnapshot.empty) {
          setFileDbOfCurrentUser("");
          deleteIndexedDatabase(filesDb);
          deleteIndexedDatabase(messagesDb);
          const welcomeMessage: Message = {
            text: "Hello, dear customer. I am Anne. Thank you for trusting Trademark Marketing Agency. Feel free to talk to us through this chat window whenever you need help or have questions. Thank you!",
            sender: "admin",
            timestamp: Date.now(),
          };
          await typedUpdateChatDoc(chatDocRef, {
            createdAt: serverTimestamp(),
            username: classifiedUserNumber,
            chatType: collectionPath,
            userActive: true,
            latestMessage: "Hello, dear customer. I am Anne...",
            latestMessageTimestamp: Date.now(),
            messageCount: 1,
            adminLastReadTimestamp: 0,
            unreadAdminMessageCount: 1,
            unreadUserMessageCount: 0,
            hasOnlyAdminMessage: true,
            lastSeenOnline: Date.now(),
          });
          setFileDbOfCurrentUser(filesDb);
          await addDoc(messagesRef, welcomeMessage);
        } else {
          setFileDbOfCurrentUser(filesDb);
        }
      } catch (error) {
        console.error("Error checking/sending welcome message:", error);
      }
    };

    try {
      const classification = await classifyUser();
      setUsername(classification.userName);
      setChatDocId(classification.chatId);
      setChatCollectionPath(classification.collectionPath as ChatType);

      await checkAndSendWelcomeMessage(
        classification.collectionPath as ChatType,
        classification.chatId,
        classification.userName
      );
    } catch (error) {
      console.error("Error initializing chat:", error);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  // Initialize chat on mount and when auth status changes
  useEffect(() => {
    initializeChat();
  }, [authUser, authContextUsername, initializeChat]);

  useEffect(() => {
    if (isInitializing || !chatDocId || !chatCollectionPath || chatOpen) {
      if (chatOpen) setUnreadAdminMessagesCount(0);
      else if (!chatDocId && !isInitializing) setUnreadAdminMessagesCount(0);
      return;
    }

    // Set userActive to false when chat is closed
    const setUserInactive = async () => {
      try {
        const chatDocRef = doc(db, chatCollectionPath, chatDocId);
        const docSnap = await getDoc(chatDocRef);

        if (docSnap.exists()) {
          typedUpdateChatDoc(chatDocRef, {
            userActive: false,
            lastSeenOnline: Date.now(),
          });
        }
      } catch (error) {
        console.error("Error setting userActive to false:", error);
      }
    };
    setUserInactive();

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
              username: username || "User",
              createdAt: serverTimestamp(),
              userLastReadTimestamp: 0,
              userActive: false,
            },
            { merge: true }
          );
        }

        const userLastRead = chatDocSnap.data()?.userLastReadTimestamp || 0;

        const messagesRef = collection(
          db,
          `${chatCollectionPath}/${chatDocId}/${FIREBASE_COLLECTIONS.CHAT_MESSAGES}`
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
  }, [isInitializing, chatDocId, chatCollectionPath, chatOpen, username]);

  useEffect(() => {
    if (isInitializing || !chatDocId || !chatCollectionPath || !chatOpen) {
      if (!chatOpen) setMessages([]);
      return;
    }

    const loadMessages = async () => {
      const { messagesDb } = getCacheDbNames(chatCollectionPath);
      try {
        // Load cached messages first
        const cachedMessages = await getCachedChatMessages(
          messagesDb,
          chatDocId
        );
        if (cachedMessages.length > 0) {
          setMessages(cachedMessages);
        }

        // Get the timestamp of the latest cached message
        const latestCachedTimestamp =
          cachedMessages.length > 0
            ? Math.max(...cachedMessages.map((msg) => msg.timestamp))
            : 0;

        const messagesRef = collection(
          db,
          `${chatCollectionPath}/${chatDocId}/${FIREBASE_COLLECTIONS.CHAT_MESSAGES}`
        );

        // Create query to get messages newer than cached ones
        const q =
          latestCachedTimestamp > 0
            ? query(
                messagesRef,
                where("timestamp", ">", latestCachedTimestamp),
                orderBy("timestamp", "asc")
              )
            : query(messagesRef, orderBy("timestamp", "asc"));

        const unsubscribeFromMessages = onSnapshot(
          q,
          async (snapshot) => {
            const newMessages = snapshot.docs.map(
              (d) => ({ id: d.id, ...d.data() } as Message)
            );

            if (newMessages.length > 0) {
              // Merge cached messages with new messages
              const allMessages =
                latestCachedTimestamp > 0
                  ? [...cachedMessages, ...newMessages]
                  : newMessages;

              setMessages(allMessages);

              await cacheChatMessages(
                messagesDb,
                chatDocId,
                chatCollectionPath,
                allMessages
              );
            } else if (cachedMessages.length === 0) {
              // No cached messages and no new messages, get all messages
              const allMessagesQuery = query(
                messagesRef,
                orderBy("timestamp", "asc")
              );
              const allMessagesSnapshot = await getDocs(allMessagesQuery);
              const allMessages = allMessagesSnapshot.docs.map(
                (d) => ({ id: d.id, ...d.data() } as Message)
              );

              setMessages(allMessages);

              if (allMessages.length > 0) {
                await cacheChatMessages(
                  messagesDb,
                  chatDocId,
                  chatCollectionPath,
                  allMessages
                );
              }
            }
          },
          (error) => {
            console.error("Error fetching messages for open chat:", error);
            setMessages([]);
          }
        );

        return unsubscribeFromMessages;
      } catch (error) {
        console.error("Error loading messages:", error);
        setMessages([]);
      }
    };

    let unsubscribe: (() => void) | undefined;

    loadMessages().then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isInitializing, chatDocId, chatCollectionPath, chatOpen]);

  useEffect(() => {
    if (isInitializing || !chatDocId || !chatCollectionPath) {
      return;
    }

    const listenForChatDelete = (): (() => void) | undefined => {
      if (!chatDocId || !chatCollectionPath) return;

      const messagesRef = collection(
        db,
        `${chatCollectionPath}/${chatDocId}/${FIREBASE_COLLECTIONS.CHAT_MESSAGES}`
      );

      const { messagesDb, filesDb } = getCacheDbNames(chatCollectionPath);

      return onSnapshot(
        messagesRef,
        (snapshot) => {
          // Only act if this is from server (not cache) and we have an established chat
          if (snapshot.metadata.fromCache || isInitializing) return;

          // Update our tracking when we see messages
          if (!snapshot.empty) {
            hasSeenMessages.current = true;
          }

          // If snapshot is empty and we previously had messages, chat was likely deleted
          if (snapshot.empty) {
            removeCachedChat(messagesDb, chatDocId);
            deleteIndexedDatabase(messagesDb);
            deleteIndexedDatabase(filesDb);
            setChatOpen(false);
            setMessages([]);
            initializeChat();
            hasSeenMessages.current = false; // Reset for next time
          }
        },
        (error) => {
          // Handle specific errors that indicate chat deletion
          if (
            error.code === "permission-denied" ||
            error.code === "not-found"
          ) {
            removeCachedChat(messagesDb, chatDocId);
            setChatOpen(false);
            setMessages([]);
          }
        }
      );
    };

    const unsubscribe = listenForChatDelete();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [
    initializeChat,
    chatDocId,
    chatCollectionPath,
    isInitializing,
    messages.length,
  ]);

  const handleToggleChat = useCallback(async () => {
    if (isInitializing || !chatDocId || !chatCollectionPath) {
      console.warn("Cannot open chat: chat not fully initialized.");
      return;
    }

    setChatOpen(true);
    setUnreadAdminMessagesCount(0);

    try {
      const chatDocRef = doc(db, chatCollectionPath, chatDocId);
      const docSnap = await getDoc(chatDocRef);
      if (docSnap.exists()) {
        await typedUpdateChatDoc(chatDocRef, {
          userLastReadTimestamp: Date.now(),
          unreadAdminMessageCount: 0,
          userActive: true,
          lastSeenOnline: Date.now(),
        });
      } else {
        // Only initialize if not already initializing
        if (!initializationRef.current && !isInitializing) {
          initializeChat();
        }
      }
    } catch (error) {
      console.error("Error updating userLastReadTimestamp:", error);
      try {
        const chatDocRef = doc(db, chatCollectionPath, chatDocId);
        await setDoc(
          chatDocRef,
          { userLastReadTimestamp: Date.now(), userActive: true },
          { merge: true }
        );
      } catch (setError) {
        console.error(
          "Error setting userLastReadTimestamp with merge:",
          setError
        );
      }
    }
  }, [isInitializing, initializeChat, chatDocId, chatCollectionPath]);

  const handleCloseChat = useCallback(async () => {
    setClosingChat(true);
    // Update userLastReadTimestamp when closing chat
    if (chatDocId && chatCollectionPath) {
      try {
        const chatDocRef = doc(db, chatCollectionPath, chatDocId);
        const docSnap = await getDoc(chatDocRef);

        if (docSnap.exists()) {
          await typedUpdateChatDoc(chatDocRef, {
            userLastReadTimestamp: Date.now(),
            unreadAdminMessageCount: 0,
            userActive: false,
            lastSeenOnline: Date.now(),
          });
        } else {
          initializeChat();
        }
      } catch (error) {
        console.error("Error updating userLastReadTimestamp on close:", error);
        try {
          const chatDocRef = doc(db, chatCollectionPath, chatDocId);
          await setDoc(
            chatDocRef,
            { userLastReadTimestamp: Date.now() },
            { merge: true }
          );
        } catch (setError) {
          console.error(
            "Error setting userLastReadTimestamp on close with merge:",
            setError
          );
        }
      }
    }
    setChatOpen(false);
    setUnreadAdminMessagesCount(0);
    setClosingChat(false);
  }, [initializeChat, chatDocId, chatCollectionPath]);

  const sendMessage = async (messageData: {
    text: string;
    files?: UploadedFileInfo[];
  }) => {
    if (
      (!messageData.text.trim() &&
        (!messageData.files || messageData.files.length === 0)) ||
      !chatDocId ||
      !chatCollectionPath ||
      !username
    ) {
      console.warn("Cannot send message: missing data", {
        chatDocId,
        chatCollectionPath,
        username,
        messageData,
      });
      return;
    }

    const message: Message = {
      text: messageData.text,
      sender: "user",
      timestamp: Date.now(),
      username: username,
      ...(messageData.files &&
        messageData.files.length > 0 && { files: messageData.files }),
    };

    const previewText = formatMessagePreview(
      messageData.text,
      messageData.files ? messageData.files.length : 0
    );

    try {
      await addDoc(
        collection(
          db,
          `${chatCollectionPath}/${chatDocId}/${FIREBASE_COLLECTIONS.CHAT_MESSAGES}`
        ),
        message
      );
      await updateChatDoc(chatCollectionPath, previewText);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    registerChatActions({
      openChat: handleToggleChat,
      setSystemMessage: setSystemGeneratedMessage,
      setSGMSender: setSGMSender,
    });

    return () => unregisterChatActions();
  }, [handleToggleChat]);

  const sendSystemGeneratedMessage = useCallback(
    async (messageText: string, sender: "user" | "admin") => {
      // Prevent duplicate sends
      if (isProcessingSystemMessage) {
        console.warn("System message already being processed");
        return;
      }

      // Validate required state
      if (!chatDocId || !chatCollectionPath || !username) {
        console.error("Cannot send system message: chat not initialized", {
          chatDocId,
          chatCollectionPath,
          username,
        });
        return;
      }
      setIsProcessingSystemMessage(true);
      try {
        const messagesRef = collection(
          db,
          `${chatCollectionPath}/${chatDocId}/${FIREBASE_COLLECTIONS.CHAT_MESSAGES}`
        );

        const chatDocRef = doc(db, chatCollectionPath, chatDocId);

        if (messageText) {
          const newSystemGeneraatedMessage: Message = {
            text: messageText,
            sender: sender,
            timestamp: Date.now(),
            isSystemGenerated: true,
          };
          const sgmPreview = formatMessagePreview(
            newSystemGeneraatedMessage.text,
            0
          );

          await Promise.all([
            addDoc(messagesRef, newSystemGeneraatedMessage),
            typedUpdateChatDoc(chatDocRef, {
              createdAt: serverTimestamp(),
              username: username,
              chatType: chatCollectionPath,
              userActive: true,
              latestMessage: sgmPreview,
              latestMessageTimestamp: Date.now(),
              hasOnlyAdminMessage: false,
              messageCount: increment(+1),
              unreadUserMessageCount: increment(+1),
              lastSeenOnline: Date.now(),
            }),
          ]);
        }
      } catch (error) {
        console.error(
          "Error error setting/sending system generated message:",
          error
        );
      } finally {
        setSystemGeneratedMessage("");
        setSGMSender("user");
        setIsProcessingSystemMessage(false);
      }
    },
    [chatDocId, chatCollectionPath, username, isProcessingSystemMessage]
  );

  useEffect(() => {
    if (!systemGeneratedMessage) {
      return;
    } else {
      sendSystemGeneratedMessage(systemGeneratedMessage, sGMSender);
    }
  }, [systemGeneratedMessage, sendSystemGeneratedMessage, sGMSender]);

  if (isInitializing && !chatDocId) {
    return (
      <div>
        <ChatToggle onClick={() => {}} unreadCount={0} />
      </div>
    );
  }

  return (
    <>
      {chatOpen && !isInitializing ? (
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
            <div className="horizontal-space-between w-full bg-blue-200 p-3">
              <div className="horizontal gap-2">
                <div className="bg-white p-2 rounded-[50%]">
                  <FaUser />
                </div>
                <p className="font-semibold max-[400px]:text-sm">
                  {isInitializing ? "Loading..." : username || "User"}
                </p>
              </div>
              {closingChat ? (
                <LoadingAnimantion text="Closing chat..." />
              ) : (
                <>
                  <UniversalButton
                    icon={IoMdClose}
                    onClick={handleCloseChat}
                    text="Close chat"
                    buttonClassName="max-[400px]:hidden"
                  />
                  <button
                    onClick={handleCloseChat}
                    className="min-[401px]:hidden rounded-md bg-gray-50 hover:bg-white p-1 sm:p-2 hover:scale-110 transition-all duration-500 cursor-pointer"
                  >
                    <IoMdClose size={20} />
                  </button>
                </>
              )}
            </div>

            <div className="flex-1 flex flex-col-reverse overflow-y-auto overflow-x-hidden chat-scrollbars p-2 mr-1">
              {messages.length > 0 ? (
                <>
                  {" "}
                  <div>
                    {messages.map((message) => (
                      <div
                        key={message.id || message.timestamp}
                        className={`flex ${
                          message.sender === "admin"
                            ? "flex-row"
                            : "flex-row-reverse justify-start"
                        } h-fit gap-2 mb-2`}
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
                          className={`relative max-w-[75%] p-2 rounded-lg mb-5 ${
                            message.sender === "admin"
                              ? "bg-blue-600 text-white"
                              : "bg-green-600 text-white"
                          }`}
                        >
                          {message.files && message.files.length > 0 && (
                            <div className="mb-2 space-y-3">
                              {message.files.map((file, index) => {
                                // Check if file is an image
                                const isImage =
                                  /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(
                                    file.fileName
                                  );

                                return (
                                  <div key={file.id || file.fileKey || index}>
                                    {isImage && (
                                      <ImageDisplay
                                        fileKey={file.fileKey}
                                        fileName={file.fileName}
                                        dbName={fileDbOfCurrentUser}
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
                                        className="!p-1"
                                        dbName={fileDbOfCurrentUser}
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
                          <p
                            className={`absolute -bottom-4 text-xs mt-1 text-gray-700 w-fit text-nowrap ${
                              message.sender === "admin"
                                ? "text-left left-0"
                                : "text-right right-0"
                            }`}
                          >
                            {formatMessageTimestamp(message.timestamp)}
                          </p>
                          {message.sender === "admin" ? (
                            <div className="absolute -top-1 -left-2 text-blue-600">
                              <BiSolidDownArrow size={19} />
                            </div>
                          ) : (
                            <div className="absolute -top-1 -right-2 text-green-600">
                              <BiSolidDownArrow size={19} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col text-center text-balance text-gray-600 italic gap-3 w-full h-full items-center justify-center">
                    <p>No messages yet.</p>
                    <p>
                      We are online! Please type your message below👇and we’ll
                      respond as soon as possible.
                    </p>
                  </div>
                </>
              )}
            </div>
            <ChatInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              sendMessage={sendMessage}
            />
          </div>
        </div>
      ) : (
        <>
          {!isInitializing && (
            <ChatToggle
              onClick={handleToggleChat}
              unreadCount={unreadAdminMessagesCount}
            />
          )}
        </>
      )}
    </>
  );
}
