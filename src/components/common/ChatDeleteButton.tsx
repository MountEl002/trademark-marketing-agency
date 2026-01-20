import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, getDocs, query } from "firebase/firestore";
import { SlOptionsVertical } from "react-icons/sl";
import { useFileDelete } from "@/hooks/useFileDelete";
import { ChatDocument, typedUpdateChatDoc } from "@/lib/chat-functions";
import { deleteCollection } from "@/utils/general-functions";
import { IoMdClose } from "react-icons/io";
import UniversalButton from "@/components/common/UniversalButton";
import { MdDelete } from "react-icons/md";
import LoadingAnimantion from "@/components/common/LoadingAnimantion";
import { deleteCompleteChatFromCache } from "@/lib/admin-chat-cache";
import {
  CHAT_TYPES,
  ChatType,
  DB_NAMES,
  FILE_DELETE_STRATEGIES,
  FIREBASE_COLLECTIONS,
} from "@/lib/constants";

interface ChatDeleteButtonProps {
  chat: ChatDocument;
  onChatDeleted: (chatId: string) => void;
  onDeleteStart?: () => void;
  onDeleteComplete?: () => void;
}

interface DeleteMessage {
  type: "success" | "error";
  text: string;
}

export default function ChatDeleteButton({
  chat,
  onChatDeleted,
  onDeleteStart,
  onDeleteComplete,
}: ChatDeleteButtonProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<DeleteMessage | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteButtonIsCurrentlyDisabled = true;

  const { deleteMultipleFiles } = useFileDelete({
    onDeleteComplete: () => {},
    onDeleteError: (fileKey, error) => {
      console.error(`Failed to delete file ${fileKey}:`, error);
    },
    showConfirmation: false, // We handle confirmation at chat level
  });

  const handleDeleteChat = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      onDeleteStart?.();

      const collectionPath: ChatType =
        chat.chatType === CHAT_TYPES.REGISTERED_USERS_CHATS
          ? CHAT_TYPES.REGISTERED_USERS_CHATS
          : CHAT_TYPES.UNREGISTERED_USERS_CHATS;

      // Step 1: Delete files if it's a registered user chat
      if (chat.chatType === CHAT_TYPES.REGISTERED_USERS_CHATS) {
        const filesRef = collection(
          db,
          `${collectionPath}/${chat.id}/${FIREBASE_COLLECTIONS.CHAT_FILES}`,
        );
        const filesSnapshot = await getDocs(query(filesRef));

        if (filesSnapshot.docs.length > 0) {
          const filesToDelete = filesSnapshot.docs.map((fileDoc) => {
            const fileData = fileDoc.data();
            return {
              fileKey: fileData.fileKey,
              fileName: fileData.fileName,
              firebasePath: `${collectionPath}/${chat.id}/${FIREBASE_COLLECTIONS.CHAT_FILES}/${fileDoc.id}`,
              deleteStrategy: FILE_DELETE_STRATEGIES.DELETE_DOCUMENT,
              dbName: DB_NAMES.ADMIN_CHAT_FILES,
            };
          });

          // Delete all files
          await deleteMultipleFiles(filesToDelete);
        }
      }

      // Step 2: Delete the message subcollection the  chat document
      await deleteCollection(
        `${collectionPath}/${chat.id}/${FIREBASE_COLLECTIONS.CHAT_MESSAGES}`,
      );
      // Step 4: Remove from cache
      await deleteCompleteChatFromCache(chat.id);

      // Step 5: Update Chat Document
      const chatDocRef = doc(db, collectionPath, chat.id);
      typedUpdateChatDoc(chatDocRef, {
        latestMessage: "[This chat has no messages]",
        latestMessageTimestamp: Date.now(),
        adminLastReadTimestamp: 0,
        unreadAdminMessageCount: 0,
        userLastReadTimestamp: 0,
        hasOnlyAdminMessage: true,
        unreadUserMessageCount: 0,
        messageCount: 0,
      });

      // Step 5: Update UI
      onChatDeleted(chat.id);
      setDeleteMessage({ type: "success", text: "Chat deleted successfully" });
      setShowDeleteConfirm(false);
      setShowOptions(false);
    } catch (error) {
      console.error("Error deleting chat:", error);
      setDeleteMessage({ type: "error", text: "Failed to delete chat" });
    } finally {
      setIsDeleting(false);
      onDeleteComplete?.();

      // Clear message after 3 seconds
      setTimeout(() => setDeleteMessage(null), 3000);
    }
  };

  return (
    <>
      <button
        className="absolute bottom-1/2 translate-y-1/2 right-1 p-2 hover:bg-gray-200 rounded-md"
        onClick={(e) => {
          e.stopPropagation();
          setShowOptions(!showOptions);
        }}
        disabled={isDeleting}
      >
        <SlOptionsVertical size={20} />
      </button>

      {showOptions && (
        <div className="absolute top-10 right-0 bg-white rounded-lg shadow-lg z-10">
          <button
            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-500 hover:text-gray-100 transition-all duration-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
              setShowOptions(false);
            }}
            disabled={isDeleting || deleteButtonIsCurrentlyDisabled}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete Chat</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this chat with {chat.username}?
              {chat.chatType === "registeredUsersChats" && (
                <span className="block mt-2 text-sm text-orange-600">
                  This will also delete all files associated with this chat.
                </span>
              )}
              <span className="block mt-2 text-sm font-medium">
                This action cannot be undone.
              </span>
            </p>
            <div className="flex justify-center gap-2">
              {isDeleting ? (
                <LoadingAnimantion />
              ) : (
                <>
                  <UniversalButton
                    icon={IoMdClose}
                    onClick={() => setShowDeleteConfirm(false)}
                    text="Cancel"
                  />
                  <UniversalButton
                    icon={MdDelete}
                    onClick={handleDeleteChat}
                    text="Delete"
                    color="red"
                    buttonClassName="!pr-3"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteMessage && (
        <div
          className={`fixed top-4 right-4 p-3 rounded-lg z-[110] ${
            deleteMessage.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {deleteMessage.text}
        </div>
      )}
    </>
  );
}
