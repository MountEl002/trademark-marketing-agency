import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { useAuth } from "@/contexts/AuthContext";
import { validateFiles } from "@/utils/s3-upload";
import { uploadFilesToS3 } from "@/utils/s3-upload";
import { UploadedFileInfo } from "@/types/order";
import { customAlphabet } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import LoadingAnimantion from "../LoadingAnimantion";
import { VscFileSymlinkFile } from "react-icons/vsc";
import { isUserSuperAdmin } from "@/utils/admin-setup";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Generate unique IDs for files
const generateId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: (messageData: {
    text: string;
    files?: UploadedFileInfo[];
  }) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  newMessage,
  setNewMessage,
  sendMessage,
}) => {
  const { user } = useAuth();
  const [adminAuthStatus, setAdminAuthStatus] = useState({
    isAdmin: false,
    adminUid: null as string | null,
  });
  const [dropBoxActive, setDropBoxActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadedFileInfo[]>([]);
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const adminStatus = await isUserSuperAdmin(firebaseUser.uid);
        setAdminAuthStatus({
          isAdmin: adminStatus,
          adminUid: adminStatus ? firebaseUser.uid : null,
        });
      } else {
        setAdminAuthStatus({
          isAdmin: false,
          adminUid: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = useCallback(
    (files: FileList | null) => {
      if (!files || (!user && !adminAuthStatus.isAdmin)) return;

      // Validate files
      const validation = validateFiles(Array.from(files), {
        maxSizeInMB: 200,
        maxFiles: 100,
      });

      if (!validation.valid) {
        setUploadError(validation.errors.join(", "));
        return;
      }

      // Create file objects with upload status
      const newFiles: UploadedFileInfo[] = Array.from(files).map((file) => ({
        id: generateId(),
        file,
        fileName: file.name,
        fileKey: "",
        progress: 0,
        status: "pending",
        uploadedBy: user?.uid || "admin",
        uploadedAt: new Date().toISOString(),
      }));

      setUploadingFiles((prev) => [...prev, ...newFiles]);
      setUploadError("");
    },
    [adminAuthStatus.isAdmin, user]
  );

  // Handle drag and drop events
  const handleFileDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDropBoxActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only deactivate if leaving the container
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

  // Remove file before upload
  const removeFile = useCallback((fileId: string) => {
    setUploadingFiles((prev) => prev.filter((file) => file.id !== fileId));
  }, []);

  const handleSendMessage = useCallback(async () => {
    try {
      setSendingMessage(true);
      // First send each file as a separate message
      if (uploadingFiles.length > 0) {
        const files = uploadingFiles
          .filter((uf) => uf.file)
          .map((uf) => uf.file as File);

        if (!user && !adminAuthStatus.isAdmin) {
          setUploadError("User is not authenticated.");
          return;
        }

        const uploaderId = adminAuthStatus.isAdmin
          ? `admin_${adminAuthStatus.adminUid}` // Use appropriate admin ID field
          : user!.uid; // Safe to use ! here as we've checked authentication

        const uploadedFiles = await uploadFilesToS3(files, uploaderId);

        // Send each file as a separate message
        for (const file of uploadedFiles) {
          // Create file info without the File object
          const fileInfo: Omit<UploadedFileInfo, "file"> = {
            id: generateId(),
            fileKey: file.fileKey,
            fileName: file.fileName,
            fileUrl: file.fileUrl,
            progress: 100,
            status: "completed",
            uploadedBy: uploaderId,
            uploadedAt: new Date().toISOString(),
          };
          sendMessage({
            text: newMessage.trim(),
            files: [fileInfo],
          });
        }
      } else {
        if (newMessage.trim()) {
          sendMessage({ text: newMessage });
        }
      }

      // Clear state after successful send
      setUploadingFiles([]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message with files:", error);
      setUploadError(
        "Failed to send files. Please check your internet connection and try again."
      );
    } finally {
      setSendingMessage(false);
    }
  }, [
    uploadingFiles,
    newMessage,
    setNewMessage,
    user,
    adminAuthStatus.isAdmin,
    adminAuthStatus.adminUid,
    sendMessage,
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
          {/* File upload preview area */}
          {uploadingFiles.length > 0 && (
            <div className="absolute bottom-[105%] right-1/2 translate-x-1/2 w-[95%] rounded-lg bg-gray-100">
              <div
                className={`flex h-20 p-2 m-2 ${
                  sendingMessage
                    ? "justify-center items-center"
                    : "flex-wrap gap-2 overflow-y-auto chat-scrollbars"
                }`}
              >
                {uploadError && (
                  <div className="absolute bg-red-500 bottom-[102%] w-fit right-1/2 translate-x-1/2 text-white text-sm p-2 rounded-md">
                    {uploadError}
                  </div>
                )}

                {sendingMessage ? (
                  <div className="vertical gap-2">
                    <LoadingAnimantion />
                    <p>
                      Sending file{uploadingFiles.length === 1 ? "" : "s"}...
                    </p>
                  </div>
                ) : (
                  uploadingFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 bg-white rounded-md p-2 text-sm h-fit"
                    >
                      <span className="truncate max-w-[150px]">
                        {file.fileName}
                      </span>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <MdClose />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {/* Error display */}
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
              (user || adminAuthStatus.isAdmin) && !sendingMessage
                ? "hover:bg-blue-600 cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            }`}
            onClick={() => fileInputRef.current?.click()}
            disabled={(!user && !adminAuthStatus.isAdmin) || sendingMessage}
            title={
              user || adminAuthStatus.isAdmin
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
              onClick={() => handleSendMessage()}
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
};

export default ChatInput;
