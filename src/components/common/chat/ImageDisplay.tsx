import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { MdImage, MdVisibility } from "react-icons/md";
import { getFromIndexedDB, saveToIndexedDB } from "@/utils/client-indexeddb";
import DownloadProgress, { DownloadProgressInfo } from "@/components/fileHandler/DownloadProgress";
import UniversalButton from "../UniversalButton";
import { IoMdClose } from "react-icons/io";
import { DatabaseName } from "@/lib/constants";

interface ImageDisplayProps {
  dbName: DatabaseName | string;
  fileKey: string;
  fileName: string;
  className?: string;
}

interface ImageData {
  src: string;
  loaded: boolean;
}

const ImageDisplay = ({
  dbName,
  fileKey,
  fileName,
  className = "",
}: ImageDisplayProps) => {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [downloadProgress, setDownloadProgress] =
    useState<DownloadProgressInfo | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [maxImage, setMaxImage] = useState(false);

  const maxImageToggle = () => {
    setMaxImage(!maxImage);
  };

  // Check if file is an image based on extension
  const isImageFile = useCallback((filename: string): boolean => {
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".bmp",
      ".svg",
    ];
    const extension = filename
      .toLowerCase()
      .substring(filename.lastIndexOf("."));
    return imageExtensions.includes(extension);
  }, []);

  // Load image from IndexedDB
  const loadImageFromIndexedDB = useCallback(async () => {
    try {
      const fileRecord = await getFromIndexedDB(
        dbName as DatabaseName,
        fileKey
      );
      if (fileRecord && fileRecord.fileBuffer) {
        const blob = new Blob([fileRecord.fileBuffer]);
        const imageUrl = URL.createObjectURL(blob);
        setImageData({ src: imageUrl, loaded: true });
        setShowPlaceholder(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error loading image from IndexedDB:", error);
      return false;
    }
  }, [fileKey, dbName]);

  // Download image from S3 and save to IndexedDB
  const downloadAndSaveImage = useCallback(async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      setDownloadProgress({
        fileKey,
        fileName,
        progress: 0,
        status: "pending",
      });

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

              setDownloadProgress({
                fileKey: data.fileKey,
                fileName: data.fileName,
                progress: data.progress,
                status: data.status,
                error: data.error,
              });

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

      // Save to IndexedDB
      await saveToIndexedDB({
        dbName: dbName as DatabaseName,
        fileKey,
        fileName,
        fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
        fileBuffer,
      });

      // Display the image
      const blob = new Blob([fileBuffer]);
      const imageUrl = URL.createObjectURL(blob);
      setImageData({ src: imageUrl, loaded: true });
      setShowPlaceholder(false);

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

      setTimeout(() => {
        setDownloadProgress(null);
        setIsDownloading(false);
      }, 3000);
    }
  }, [fileKey, fileName, dbName, isDownloading]);

  // Initial load attempt from IndexedDB
  useEffect(() => {
    if (isImageFile(fileName)) {
      loadImageFromIndexedDB();
    }
  }, [fileName, fileKey, isImageFile, loadImageFromIndexedDB]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (imageData?.src && imageData.src.startsWith("blob:")) {
        URL.revokeObjectURL(imageData.src);
      }
    };
  }, [imageData?.src]);

  // Don't render if not an image file
  if (!isImageFile(fileName)) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Download Progress */}
      {downloadProgress && (
        <div className="absolute top-0 left-0 right-0 z-20 mb-2">
          <DownloadProgress downloadInfo={downloadProgress} />
        </div>
      )}

      {/* Image Display or Placeholder */}
      {showPlaceholder || !imageData ? (
        <div className="relative w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
          <MdImage size={32} className="text-gray-400 mb-2" />
          <p className="text-xs text-gray-500 text-center mb-2 px-2">
            {fileName}
          </p>
          <button
            onClick={downloadAndSaveImage}
            disabled={isDownloading}
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-xs transition-colors"
          >
            <MdVisibility size={14} />
            {isDownloading ? "Loading..." : "View"}
          </button>
        </div>
      ) : (
        <div className="relative w-full">
          <Image
            src={imageData.src}
            alt={fileName}
            width={300}
            height={200}
            onClick={maxImageToggle}
            className="w-full h-auto max-h-64 object-contain rounded-lg cursor-pointer"
            onError={() => {
              console.error("Image load error for:", fileName);
              setShowPlaceholder(true);
              setImageData(null);
            }}
          />
          {maxImage ? (
            <>
              <div
                className="fixed inset-0 z-[150] flex flex-col justify-center items-center bg-black/90 gap-3 w-full h-full p-10 overflow-auto"
                onClick={maxImageToggle}
              >
                <UniversalButton
                  icon={IoMdClose}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    maxImageToggle();
                  }}
                  text="Close"
                />
                <Image
                  src={imageData.src}
                  alt={fileName}
                  width={800}
                  height={800}
                  className="max-w-full max-h-full object-contain rounded-lg bg-gray-300"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  onError={() => {
                    console.error("Image load error for:", fileName);
                    setShowPlaceholder(true);
                    setImageData(null);
                  }}
                />
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
