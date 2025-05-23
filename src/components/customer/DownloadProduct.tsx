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
import PlaceholderProductImage from "@/assests/PlaceholderProduct.jpg";

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
  const [downloadingImage, setDownloadingImage] = useState(false);

  useEffect(() => {
    async function fetchFileData() {
      try {
        setFetchingData(true);

        // Get the latest product file
        const filesQuery = query(
          collection(db, "productFiles"),
          orderBy("uploadedAt", "desc"),
          limit(1)
        );

        const querySnapshot = await getDocs(filesQuery);

        if (!querySnapshot.empty) {
          const latestDoc = querySnapshot.docs[0];
          const data = latestDoc.data();

          const fileData = {
            docId: latestDoc.id,
            uploadedAt: data.uploadedAt?.toDate() || new Date(),
            fileName: data.fileName || "Unknown",
            fileUrl: data.fileUrl || "",
          };

          setFileData(fileData);

          // Handle image download and local storage
          await handleImageDownload(fileData);
        } else {
          console.log("No product files found");
        }
      } catch (error) {
        console.error("Error fetching file data:", error);
      } finally {
        setFetchingData(false);
      }
    }

    fetchFileData();
  }, []);

  const handleImageDownload = async (fileData: FileData) => {
    try {
      setDownloadingImage(true);

      // Clean up old files from localStorage (files older than 24 hours)
      cleanupOldFiles();

      // Check if image already exists in localStorage
      const existingImageUrl = getFileFromLocalStorage(fileData.fileUrl);

      if (existingImageUrl) {
        setLocalImageUrl(existingImageUrl);
        return;
      }

      // Download and store the image
      const downloadedImageUrl = await downloadAndStoreFile(
        fileData.fileUrl,
        fileData.fileName
      );

      if (downloadedImageUrl) {
        setLocalImageUrl(downloadedImageUrl);
      } else {
        console.error("Failed to download image");
        // Keep the original URL as fallback
        setLocalImageUrl(fileData.fileUrl);
      }
    } catch (error) {
      console.error("Error handling image download:", error);
      // Use original URL as fallback
      setLocalImageUrl(fileData.fileUrl);
    } finally {
      setDownloadingImage(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloadingImage(true);

      // Determine which image to download
      let imageUrl: string;
      let fileName = fileData?.fileName || "download_image";

      // If localImageUrl is not available, use PlaceholderProductImage
      if (!localImageUrl) {
        // Handle StaticImageData type from Next.js
        imageUrl =
          typeof PlaceholderProductImage === "string"
            ? PlaceholderProductImage
            : PlaceholderProductImage.src;
        fileName = "product_image.png";
      } else {
        imageUrl = localImageUrl;
      }

      if (!imageUrl) {
        throw new Error("No image available for download");
      }

      // Create a temporary anchor element to trigger download
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
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
      setDownloadingImage(false);
    }
  };

  if (fetchingData) {
    return <LoadingScreen message="Loading Product" />;
  }

  return (
    <>
      <div className="mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden max-w-3xl w-full">
        <div className="vertical gap-8 py-8 text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            DOWNLOAD THIS IMAGE AND POST ON YOUR STATUS TO EARN WITH VIEWS
          </h1>
          <button
            onClick={handleDownload}
            disabled={downloadingImage}
            className="w-fit horizontal bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloadingImage ? (
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

          <div>
            {localImageUrl ? (
              <div className="vertical w-full h-full">
                <Image
                  src={localImageUrl}
                  alt="Promotion"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            ) : (
              <div className="vertical w-full h-full">
                <Image
                  src={PlaceholderProductImage}
                  alt="Promotion"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto rounded-lg"
                />
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
