//Downlaod.tsx

import { useState, useCallback } from "react";
import { MdDownload } from "react-icons/md";
import { getFromIndexedDB, saveToIndexedDB } from "@/utils/client-indexeddb";
import { DatabaseName } from "@/lib/constants";
import DownloadProgress, { DownloadProgressInfo } from "./DownloadProgress";

interface DownloadProps {
  dbName: DatabaseName | string; // Database name for IndexedDB
  fileKey: string;
  fileName: string;
  className?: string;
  userId?: string;
}

// LocalStorage fallback utilities
const saveToLocalStorage = (fileKey: string, fileData: ArrayBuffer): void => {
  try {
    const base64String = btoa(String.fromCharCode(...new Uint8Array(fileData)));
    localStorage.setItem(`hq-essay-file-${fileKey}`, base64String);
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
    throw error;
  }
};

const getFromLocalStorage = (fileKey: string): ArrayBuffer | null => {
  try {
    const base64String = localStorage.getItem(`hq-essay-file-${fileKey}`);
    if (!base64String) return null;

    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (error) {
    console.error("Failed to get from localStorage:", error);
    return null;
  }
};

// Utility to trigger file download
const triggerFileDownload = (
  fileBuffer: ArrayBuffer,
  fileName: string
): void => {
  const blob = new Blob([fileBuffer]);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function Download({
  dbName,
  fileKey,
  fileName,
  className = "",
}: // userId,
DownloadProps) {
  const [downloadProgress, setDownloadProgress] =
    useState<DownloadProgressInfo | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFile = useCallback(async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      setDownloadProgress({
        fileKey,
        fileName,
        progress: 0,
        status: "pending",
      });

      // Step 1: Check IndexedDB first
      try {
        const existingFile = await getFromIndexedDB(
          dbName as DatabaseName,
          fileKey
        );
        if (existingFile) {
          setDownloadProgress({
            fileKey,
            fileName,
            progress: 100,
            status: "completed",
          });

          triggerFileDownload(existingFile.fileBuffer, fileName);

          setTimeout(() => {
            setDownloadProgress(null);
            setIsDownloading(false);
          }, 1000);
          return;
        }
      } catch (indexedDBError) {
        console.error(
          "IndexedDB read failed, trying localStorage:",
          indexedDBError
        );
      }

      // Step 2: Check localStorage fallback
      try {
        const localFile = getFromLocalStorage(fileKey);
        if (localFile) {
          setDownloadProgress({
            fileKey,
            fileName,
            progress: 100,
            status: "completed",
          });

          triggerFileDownload(localFile, fileName);

          setTimeout(() => {
            setDownloadProgress(null);
            setIsDownloading(false);
          }, 1000);
          return;
        }
      } catch (localStorageError) {
        console.error(
          "localStorage read failed, downloading from S3:",
          localStorageError
        );
      }

      // Step 3: Download from S3 if not found in local storage
      const response = await fetch("/api/files-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileKey, fileName }),
      });

      if (!response.ok) {
        throw new Error(
          `Download failed: ${response.status} ${response.statusText}`
        );
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream available");

      const decoder = new TextDecoder();
      let buffer = "";
      let fileBuffer: ArrayBuffer | null = null;

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

              // Update progress
              setDownloadProgress({
                fileKey: data.fileKey,
                fileName: data.fileName,
                progress: data.progress,
                status: data.status,
                error: data.error,
              });

              // Capture file buffer when received
              if (data.fileBuffer && Array.isArray(data.fileBuffer)) {
                fileBuffer = new Uint8Array(data.fileBuffer).buffer;
              }
            } catch (parseError) {
              console.error("Error parsing download data:", parseError);
            }
          }
        }
      }

      if (!fileBuffer) {
        throw new Error("No file data received from server");
      }

      // Step 4: Save to IndexedDB (with fallback to localStorage)
      try {
        await saveToIndexedDB({
          dbName: dbName as DatabaseName,
          fileKey,
          fileName,
          fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
          fileBuffer,
        });
      } catch (indexedDBSaveError) {
        console.error(
          "Failed to save to IndexedDB, trying localStorage:",
          indexedDBSaveError
        );
        try {
          saveToLocalStorage(fileKey, fileBuffer);
        } catch (localStorageSaveError) {
          console.error(
            "Failed to save to both IndexedDB and localStorage:",
            localStorageSaveError
          );
          // Continue with download even if storage fails
        }
      }

      // Step 5: Trigger file download
      triggerFileDownload(fileBuffer, fileName);

      // Clear progress after short delay
      setTimeout(() => {
        setDownloadProgress(null);
        setIsDownloading(false);
      }, 1000);
    } catch (error) {
      console.error("Download error:", error);
      setDownloadProgress({
        fileKey,
        fileName,
        progress: 0,
        status: "error",
        error: error instanceof Error ? error.message : "Download failed",
      });

      // Clear error after delay
      setTimeout(() => {
        setDownloadProgress(null);
        setIsDownloading(false);
      }, 3000);
    }
  }, [fileKey, fileName, dbName, isDownloading]);

  return (
    <div className="w-full">
      {/* Download Progress */}
      {downloadProgress ? (
        <div className="w-full z-10">
          <DownloadProgress downloadInfo={downloadProgress} />
        </div>
      ) : (
        <button
          onClick={downloadFile}
          disabled={isDownloading}
          className={`group bg-gray-50 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded transition-all duration-500 ${className}`}
          title={`Download ${fileName}`}
        >
          <MdDownload
            className={`transition-transform duration-300 text-gray-700 ${
              isDownloading ? "animate-pulse" : "group-hover:scale-110"
            }`}
            size={16}
          />
        </button>
      )}
    </div>
  );
}
