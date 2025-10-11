import { VscFileSymlinkFile } from "react-icons/vsc";
import { useAuth } from "@/contexts/AuthContext";
import { customAlphabet } from "nanoid";
import { useCallback, useRef, useState } from "react";
import LoadingAnimantion from "@/components/common/LoadingAnimantion";
import FileUploadProgress, { FileProgressInfo } from "./FileUploadProgress";
import { saveToIndexedDB } from "@/utils/client-indexeddb";
import {
  COMMON_CONSTANTS,
  CommonConstant,
  DB_NAMES,
  FIREBASE_COLLECTIONS,
} from "@/lib/constants";
import { UploadedFileInfo } from "@/types/globalTypes";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { FaCloudUploadAlt } from "react-icons/fa";
import UniversalButton from "../common/UniversalButton";
import { validateFiles } from "@/lib/cleint-side-s3-upload";
import { useFileSelection } from "@/hooks/useFileSelection";

const generateId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);

interface FileUploaderProps {
  orderNumber: string;
  onFilesUploaded?: (files: UploadedFileInfo[]) => void;
  fileSelection: ReturnType<typeof useFileSelection>;
  bgColor?: string;
  infoTextColor?: string;
  filesField: CommonConstant;
  providedUserId?: string;
}

export default function FileUploader({
  orderNumber,
  onFilesUploaded,
  fileSelection,
  bgColor = "bg-gray-200",
  infoTextColor = "text-gray-600",
  filesField,
  providedUserId,
}: FileUploaderProps) {
  const { user, isAdmin } = useAuth();
  const [dropBoxActive, setDropBoxActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<FileProgressInfo[]>([]);
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const getUserId = useCallback((): string | null => {
    if (providedUserId) {
      return providedUserId.trim() || null;
    }

    if (isAdmin && user?.uid) {
      return `admin_${user.uid}`;
    }

    if (user?.uid) {
      return user.uid;
    }

    return null;
  }, [providedUserId, isAdmin, user?.uid]);

  const isAuthenticated = useCallback((): boolean => {
    return !!(user?.uid || (isAdmin && user?.uid) || providedUserId?.trim());
  }, [providedUserId, isAdmin, user?.uid]);

  const {
    selectedFiles,
    addFiles,
    removeFile: removeSelectedFile,
    clearFiles,
  } = fileSelection;

  const handleFileChange = useCallback(
    (files: FileList | null) => {
      if (!files || !isAuthenticated()) {
        setUploadError("You are not authorized to upload files!");
        return;
      }

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
      addFiles(filesArray);

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
    [isAuthenticated, addFiles]
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
      const fileIndex = uploadingFiles.findIndex((f) => f.fileId === fileId);
      if (fileIndex !== -1) {
        removeSelectedFile(fileIndex);
      }
    },
    [uploadingFiles, removeSelectedFile]
  );

  const handleUploadFiles = useCallback(async () => {
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
          FIREBASE_COLLECTIONS.ORDERS
        );
        formData.append(COMMON_CONSTANTS.ORDER_NUMBER, orderNumber.toString());
        formData.append(COMMON_CONSTANTS.FILES_FIELD, filesField);

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
                    dbName: DB_NAMES.ORDER_FILES,
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

    if (selectedFiles.length === 0) return;

    try {
      setUploading(true);
      setUploadError("");

      // If there are files selected, upload them
      if (selectedFiles.length > 0) {
        const userId = getUserId();
        if (!userId) {
          setUploadError("Authentication error: Unable to determine user ID");
          return;
        }

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
            onFilesUploaded?.(validFiles);
          } else {
            throw new Error("No files were uploaded successfully");
          }
        } catch (uploadError) {
          console.error("File upload failed:", uploadError);
          setUploadError("Failed to upload files. Please try again.");
          return;
        }
      }

      // Clear state
      setUploadingFiles([]);
      clearFiles();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setUploadError("Failed to send message. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [
    selectedFiles,
    uploadingFiles,
    clearFiles,
    onFilesUploaded,
    orderNumber,
    filesField,
    getUserId,
  ]);

  return (
    <>
      <div
        className="horizontal-start w-full h-fit p-1"
        ref={containerRef}
        onDragOver={handleFileDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {dropBoxActive && (
          <div className="absolute inset-0 vertical z-[55] gap-6 -mx-2 -my-3 bg-black/55 backdrop-blur-md rounded-lg">
            <p className="text-white text-xl sm:text-2xl">Drop files here</p>
            <VscFileSymlinkFile size={35} className="text-white" />
          </div>
        )}
        <div className="flex flex-col justify-center items-start gap-3 w-full h-fit">
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 w-full max-[360px]:text-xs ${bgColor} transition-all duration-500 rounded-lg border-dashed border border-red-600 hover:border-blue-500 px-2 py-6 ${infoTextColor}`}
            disabled={!isAuthenticated() || uploading}
            title={
              isAuthenticated()
                ? "Attach files"
                : "Please login or signup to attach files"
            }
          >
            <VscFileSymlinkFile size={22} />
            <div>
              <span className="text-blue-500">Browse </span>
              or drag and drop files here
            </div>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files)}
            multiple
            className="hidden"
          />
          <div className={`horizontal-start gap-2 text-sm mt-2`}>
            <HiOutlineInformationCircle size={23} className="flex-shrink-0" />
            <p>
              Maximun file size is 200 MB. Also, you can add a Dropbox,
              Sendspace, or Google dirve link in the instructions.
            </p>
          </div>
          {/* File upload progress */}
          {uploadingFiles.length > 0 && (
            <div className="w-full">
              <FileUploadProgress
                files={uploadingFiles}
                onRemoveFile={removeFile}
                showRemoveButton={!uploading}
              />

              {uploadError && (
                <div className="mt-2 bg-red-500 text-white text-sm p-2 rounded-md">
                  {uploadError}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center items-center w-full">
            {uploading ? (
              <LoadingAnimantion />
            ) : (
              <>
                {selectedFiles.length > 0 && (
                  <UniversalButton
                    icon={FaCloudUploadAlt}
                    text="Upload"
                    onClick={handleUploadFiles}
                    color="green"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
