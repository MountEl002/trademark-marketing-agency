import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { VscFileSymlinkFile } from "react-icons/vsc";
import { useAuth } from "@/contexts/AuthContext";
import { customAlphabet } from "nanoid";
import { useCallback, useRef, useState } from "react";
import LoadingAnimantion from "../LoadingAnimantion";
import FileUploadProgress, {
  FileProgressInfo,
} from "../../fileHandler/FileUploadProgress";
import { saveToIndexedDB } from "@/utils/client-indexeddb";
import {
  COMMON_CONSTANTS,
  DB_NAMES,
  FIREBASE_COLLECTIONS,
} from "@/lib/constants";
import { UploadedFileInfo } from "@/types/globalTypes";
import { validateFiles } from "@/lib/cleint-side-s3-upload";

const generateId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: (messageData: {
    text: string;
    files?: UploadedFileInfo[];
  }) => void;
}

export default function ChatInput({
  newMessage,
  setNewMessage,
  sendMessage,
}: ChatInputProps) {
  const { user, isAdmin } = useAuth();
  const [dropBoxActive, setDropBoxActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<FileProgressInfo[]>([]);
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const uploadFileToServer = async (
    file: File,
    fileId: string,
    userId: string
  ): Promise<UploadedFileInfo | null> => {
    try {
      const formData = new FormData();
      formData.append(COMMON_CONSTANTS.FILE, file);
      formData.append(COMMON_CONSTANTS.USER_ID, userId);
      formData.append(
        COMMON_CONSTANTS.FIREBASE_COLLECTION,
        FIREBASE_COLLECTIONS.CHAT_FILES
      );

      const response = await fetch("/api/files-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";
      let finalFileInfo: UploadedFileInfo | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              // Update progress for the specific file
              setUploadingFiles((prev) =>
                prev.map((f) =>
                  f.fileId === fileId
                    ? {
                        ...f,
                        progress: data.progress,
                        status: data.status,
                        error: data.error,
                      }
                    : f
                )
              );

              // If completed, prepare file info and save to IndexedDB
              if (data.status === "completed") {
                finalFileInfo = {
                  id: fileId,
                  fileKey: data.fileKey,
                  fileName: data.fileName,
                  fileUrl: data.fileUrl,
                  progress: 100,
                  status: "completed",
                  uploadedBy: userId,
                  uploadedAt: new Date().toISOString(),
                };

                // Save to IndexedDB in background - don't block the upload
                const fileBuffer = await file.arrayBuffer();
                saveToIndexedDB({
                  dbName: DB_NAMES.CHAT_FILES,
                  fileKey: data.fileKey,
                  fileName: data.fileName,
                  fileUrl: data.fileUrl,
                  fileBuffer,
                }).catch((error) => {
                  // Log IndexedDB errors but don't show to user
                  console.error("IndexedDB save error:", error);
                });
              }
            } catch (e) {
              console.error("Error parsing progress data:", e);
            }
          }
        }
      }

      return finalFileInfo;
    } catch (error) {
      console.error("Upload error:", error);
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.fileId === fileId
            ? {
                ...f,
                status: "error" as const,
                error: "Upload failed",
              }
            : f
        )
      );
      throw error;
    }
  };

  const handleFileChange = useCallback(
    (files: FileList | null) => {
      if (!files || (!user && !isAdmin)) return;

      const validation = validateFiles(Array.from(files), {
        maxSizeInMB: 200,
        maxFiles: 100,
      });

      if (!validation.valid) {
        setUploadError(validation.errors.join(", "));
        return;
      }

      // Store actual File objects - APPEND to existing files
      const filesArray = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);

      // Create preview files for UI - APPEND to existing files
      const newFiles: FileProgressInfo[] = filesArray.map((file) => ({
        fileId: generateId(),
        fileName: file.name,
        progress: 0,
        status: "pending",
      }));

      setUploadingFiles((prev) => [...prev, ...newFiles]);
      setUploadError("");
    },
    [isAdmin, user]
  );
  const handleFileDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDropBoxActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (
      containerRef.current &&
      e.relatedTarget &&
      !containerRef.current.contains(e.relatedTarget as Node)
    ) {
      setDropBoxActive(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDropBoxActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileChange(e.dataTransfer.files);
      }
    },
    [handleFileChange]
  );

  const removeFile = useCallback(
    (fileId: string) => {
      setUploadingFiles((prev) =>
        prev.filter((file) => file.fileId !== fileId)
      );
      // Also remove from selected files by finding the index
      setSelectedFiles((prev) => {
        const fileIndex = uploadingFiles.findIndex((f) => f.fileId === fileId);
        if (fileIndex !== -1) {
          return prev.filter((_, index) => index !== fileIndex);
        }
        return prev;
      });
    },
    [uploadingFiles]
  );

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;

    try {
      setSendingMessage(true);

      // If there are files selected, upload them
      if (selectedFiles.length > 0) {
        const userId = isAdmin ? `admin_${user?.uid}` : user!.uid;

        const uploadPromises = selectedFiles.map((file, index) => {
          const fileInfo = uploadingFiles[index];
          return uploadFileToServer(file, fileInfo.fileId, userId);
        });

        try {
          const uploadedFiles = await Promise.all(uploadPromises);
          const validFiles = uploadedFiles.filter(
            (file): file is UploadedFileInfo => file !== null
          );

          if (validFiles.length > 0) {
            sendMessage({
              text: newMessage.trim(),
              files: validFiles,
            });
          } else {
            throw new Error("No files were uploaded successfully");
          }
        } catch (uploadError) {
          console.error("File upload failed:", uploadError);
          setUploadError("Failed to upload files. Please try again.");
          return;
        }
      } else if (newMessage.trim()) {
        // Send text-only message
        sendMessage({ text: newMessage });
      }

      // Clear state
      setNewMessage("");
      setUploadingFiles([]);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setUploadError("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  }, [
    newMessage,
    selectedFiles,
    uploadingFiles,
    user,
    isAdmin,
    sendMessage,
    setNewMessage,
  ]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <div
        className="relative horizontal-start w-full h-20 bg-gray-100 p-1"
        ref={containerRef}
        onDragOver={handleFileDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {dropBoxActive && (
          <div className="absolute vertical inset-0 bg-black/50 z-[101] gap-3">
            <p className="text-white text-md">Drop here</p>
            <VscFileSymlinkFile size={20} className="text-white" />
          </div>
        )}

        <div className="w-[90%] h-full border border-blue-500 rounded-lg p-1">
          {/* File upload progress */}
          {uploadingFiles.length > 0 && (
            <div className="absolute bottom-[105%] right-1/2 translate-x-1/2 w-[95%]">
              <FileUploadProgress
                files={uploadingFiles}
                onRemoveFile={removeFile}
                showRemoveButton={!sendingMessage}
              />

              {uploadError && (
                <div className="mt-2 bg-red-500 text-white text-sm p-2 rounded-md">
                  {uploadError}
                </div>
              )}
            </div>
          )}

          <textarea
            name="message"
            id="message"
            placeholder="Type your message..."
            value={newMessage}
            onKeyDown={sendingMessage ? undefined : handleKeyPress}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full h-full p-2 bg-transparent outline-none resize-none chat-scrollbars text-sm whitespace-normal overflow-x-auto"
          />
        </div>

        <div className="vertical gap-1 w-[10%] h-full bg-transparent">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files)}
            multiple
            className="hidden"
          />

          <button
            className={`group bg-transparent rounded-[50%] transition-all duration-500 p-2 ${
              (user || isAdmin) && !sendingMessage
                ? "hover:bg-blue-600 cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            }`}
            onClick={() => fileInputRef.current?.click()}
            disabled={(!user && !isAdmin) || sendingMessage}
            title={
              user || isAdmin
                ? "Attach files"
                : "Please login or signup to attach files"
            }
          >
            <GrAttachment className="text-blue-600 group-hover:text-white transition-all duration-500" />
          </button>

          {sendingMessage ? (
            <LoadingAnimantion />
          ) : (
            <button
              onClick={handleSendMessage}
              className="group bg-transparent hover:bg-blue-600 rounded-[50%] transition-all duration-500 p-2"
              title="Send message"
            >
              <IoSend className="text-blue-600 group-hover:text-white transition-all duration-500" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
