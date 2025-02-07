"use client";

import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import AdminChatWindow from "@/components/admin/chats/AdminChatWindow";

interface ChatPreview {
  id: string;
  userNumber: string;
  lastMessage?: string;
  createdAt: number;
}

export default function AdminChatPage() {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);

  const handleChatClick = (chat: ChatPreview) => {
    setSelectedChat(chat);
  };

  useEffect(() => {
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
                userNumber: doc.id, // For registered users, use doc ID as user number
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
        setLoading(false);
      }
    }

    fetchChats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-pulse text-gray-600">Loading chats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h2 className="text-red-800 font-medium mb-2">Error</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Chats</h1>
        <span className="text-sm text-gray-500">
          {chats.length} {chats.length === 1 ? "chat" : "chats"} found
        </span>
      </div>

      {chats.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No chats found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="block p-4 border rounded-lg hover:bg-gray-50 transition duration-150"
              onClick={() => handleChatClick(chat)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">User {chat.userNumber}</span>
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
      {selectedChat && (
        <AdminChatWindow
          chatId={selectedChat.id}
          userNumber={selectedChat.userNumber}
          isRegisteredUser={selectedChat.id.length > 10} // Simple check to differentiate between registered and unregistered users
          onClose={() => setSelectedChat(null)}
        />
      )}
    </div>
  );
}
