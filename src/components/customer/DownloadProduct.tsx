"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiDownload, FiCheck, FiX, FiLoader } from "react-icons/fi";
import Image from "next/image";
import {
  downloadAndStoreFile,
  getFileFromLocalStorage,
  cleanupOldFiles,
} from "@/utils/download-user-files";
import LoadingScreen from "../common/LoadingScreen";

interface FileData {
  docId: string;
  uploadedAt: Date;
  fileName: string;
  fileUrl: string;
}

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  success: boolean;
  message: string;
}

function DownloadDialog({ isOpen, onClose, success, message }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex items-center mb-4">
          {success ? (
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mr-3">
              <FiCheck className="text-green-600 text-xl" />
            </div>
          ) : (
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mr-3">
              <FiX className="text-red-600 text-xl" />
            </div>
          )}
          <h3 className="text-lg font-bold text-gray-800">
            {success ? "Download Successful" : "Download Failed"}
          </h3>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DownloadProduct() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSuccess, setDialogSuccess] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [fetchingData, setFetchingData] = useState(true);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const [downloadingImage, setDownloadingImage] = useState(false); // Tracks overall image processing for display
  const [isDownloadingFile, setIsDownloadingFile] = useState(false); // Tracks file download action specifically

  useEffect(() => {
    async function fetchFileData() {
      setFetchingData(true);
      setDownloadingImage(true); // Indicate that we are attempting to get an image
      try {
        const filesQuery = query(
          collection(db, "productFiles"),
          orderBy("uploadedAt", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(filesQuery);

        if (!querySnapshot.empty) {
          const latestDoc = querySnapshot.docs[0];
          const data = latestDoc.data();
          const newFileData: FileData = {
            docId: latestDoc.id,
            uploadedAt: data.uploadedAt?.toDate() || new Date(),
            fileName: data.fileName || "Unknown",
            fileUrl: data.fileUrl || "",
          };
          setFileData(newFileData);
          await handleImageProcessing(newFileData);
        } else {
          console.log("No product files found");
          setFileData(null);
          setLocalImageUrl(null);
        }
      } catch (error) {
        console.error("Error fetching file data:", error);
        setFileData(null);
        setLocalImageUrl(null);
      } finally {
        setFetchingData(false);
        setDownloadingImage(false); // Done with initial image attempt
      }
    }

    fetchFileData();
  }, []);

  const handleImageProcessing = async (currentFileData: FileData) => {
    // This function tries to get a local version of the image
    // If successful, localImageUrl is set. Otherwise, it's set to null.
    setDownloadingImage(true);
    try {
      cleanupOldFiles();
      const existingImageUrl = getFileFromLocalStorage(currentFileData.fileUrl);

      if (existingImageUrl) {
        setLocalImageUrl(existingImageUrl);
        return;
      }

      if (!currentFileData.fileUrl) {
        console.error("No file URL provided in fileData.");
        setLocalImageUrl(null);
        return;
      }

      const downloadedImageUrl = await downloadAndStoreFile(
        currentFileData.fileUrl,
        currentFileData.fileName
      );

      if (downloadedImageUrl) {
        setLocalImageUrl(downloadedImageUrl);
      } else {
        console.error("Failed to download and store image for local use.");
        setLocalImageUrl(null);
      }
    } catch (error) {
      console.error("Error processing image for local use:", error);
      setLocalImageUrl(null);
    } finally {
      setDownloadingImage(false);
    }
  };

  const handleActualDownload = async () => {
    if (!localImageUrl || !fileData) {
      // Ensure fileData is also available for filename
      setDialogSuccess(false);
      setDialogMessage(
        "No image available to download or file data is missing."
      );
      setDialogOpen(true);
      return;
    }

    setIsDownloadingFile(true);
    try {
      const response = await fetch(localImageUrl);
      const blob = await response.blob();

      let finalFileName = fileData.fileName || "product_image";
      // Ensure filename has an extension if possible
      if (!/\.[^/.]+$/.test(finalFileName)) {
        const type = blob.type; // e.g. "image/jpeg"
        if (type && type.startsWith("image/")) {
          const extension = type.split("/")[1];
          if (extension && !finalFileName.endsWith(`.${extension}`)) {
            finalFileName = `${finalFileName}.${extension}`;
          } else if (!extension && !finalFileName.includes(".")) {
            // if no extension found and no dot present
            finalFileName = `${finalFileName}.png`; // Fallback extension
          }
        } else if (!finalFileName.includes(".")) {
          // if not an image type and no dot present
          finalFileName = `${finalFileName}.png`; // Fallback extension
        }
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = finalFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDialogSuccess(true);
      setDialogMessage(
        "Image downloaded successfully! Post it on your status to start earning."
      );
      setDialogOpen(true);
    } catch (error) {
      console.error("Download failed:", error);
      setDialogSuccess(false);
      setDialogMessage("Failed to download image. Please try again.");
      setDialogOpen(true);
    } finally {
      setIsDownloadingFile(false);
    }
  };

  if (fetchingData) {
    return <LoadingScreen message="Loading Product..." />;
  }

  return (
    <>
      <div className="mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden max-w-3xl w-full">
        <div className="flex flex-col items-center gap-8 py-8 text-center px-4">
          {" "}
          {/* Changed to flex flex-col items-center */}
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            DOWNLOAD THIS IMAGE AND POST ON YOUR STATUS TO EARN WITH VIEWS
          </h1>
          <button
            onClick={handleActualDownload}
            disabled={isDownloadingFile || downloadingImage || !localImageUrl}
            className="w-fit flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloadingFile ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                DOWNLOADING...
              </>
            ) : (
              <>
                <FiDownload className="mr-2" />
                DOWNLOAD NOW
              </>
            )}
          </button>
          <div className="mt-6 w-full">
            {" "}
            {/* Added w-full */}
            {downloadingImage && !localImageUrl ? ( // Show loader while initially trying to get image
              <div className="vertical w-full h-full flex items-center justify-center min-h-[200px] p-4">
                <FiLoader className="animate-spin text-4xl text-gray-500" />
              </div>
            ) : localImageUrl ? (
              <div className="vertical w-full h-full">
                <Image
                  src={localImageUrl}
                  alt={fileData?.fileName || "Promotion"}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto rounded-lg max-h-[70vh] object-contain" // Added object-contain
                  priority
                  // Consider adding priority if this is LCP (comment on a new line or use {/* ... */})
                />
              </div>
            ) : (
              <div className="vertical w-full h-full flex items-center justify-center min-h-[200px] bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4">
                <p className="text-gray-500 text-lg">there is not product</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <DownloadDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        success={dialogSuccess}
        message={dialogMessage}
      />
    </>
  );
}
