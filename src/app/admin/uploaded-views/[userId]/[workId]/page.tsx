"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  getDoc,
  increment, // Import increment
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiChevronLeft, FiEye, FiEdit, FiCheck, FiX } from "react-icons/fi";
import Image from "next/image";
import {
  downloadAndStoreFile,
  getFileFromLocalStorage,
  cleanupOldFiles,
} from "@/utils/download-user-files";

interface FileData {
  docId: string;
  workId: string;
  uploadedAt: Date;
  status: string;
  views: number;
  amount: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
}

interface StatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  currentStatus: string;
}

function StatusDialog({
  isOpen,
  onClose,
  onStatusChange,
  currentStatus,
}: StatusDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Change Status</h3>
        <p className="text-gray-600 mb-6">
          Current status: <span className="font-medium">{currentStatus}</span>
        </p>

        <div className="space-y-3">
          <button
            onClick={() => onStatusChange("confirmed")}
            className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiCheck className="mr-2" />
            Mark as Confirmed
          </button>
          <button
            onClick={() => onStatusChange("disputed")}
            className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FiX className="mr-2" />
            Mark as Disputed
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ImageDetailPage({
  params,
}: {
  params: Promise<{ userId: string; workId: string }>; // Changed username to userId
}) {
  const resolvedParams = React.use(params);
  const { userId, workId } = resolvedParams; // Changed username to userId

  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [fetchingData, setFetchingData] = useState(true);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const [downloadingImage, setDownloadingImage] = useState(false);
  const [displayUsername, setDisplayUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login");
      return;
    }

    async function fetchFileDataAndUser() {
      try {
        setFetchingData(true);

        // Fetch user's username for display
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setDisplayUsername(userDocSnap.data().username || "User");
        } else {
          console.error("User not found for image detail:", userId);
          // If user not found, the file query below might also fail or be incorrect
          router.push("/admin/uploaded-views"); // Redirect if user is essential
          return;
        }

        // Get the specific file with the workId using userId
        const filesQuery = query(
          collection(db, "users", userId, "files"),
          where("workId", "==", parseInt(workId)) // Assuming workId in DB is number
        );
        const filesSnapshot = await getDocs(filesQuery);

        if (filesSnapshot.empty) {
          console.error(
            "File not found with workId:",
            workId,
            "for user:",
            userId
          );
          router.push(`/admin/uploaded-views/${userId}`); // Go back to user's file list
          return;
        }

        const fileDoc = filesSnapshot.docs[0];
        const data = fileDoc.data();

        const currentFileData = {
          docId: fileDoc.id,
          workId: data.workId?.toString() || "N/A",
          uploadedAt: data.uploadedAt?.toDate() || new Date(),
          status: data.status || "pending",
          views: data.views || 0,
          amount: data.amount || 0,
          fileName: data.fileName || "Unknown",
          fileUrl: data.fileUrl || "",
          fileType: data.fileType || "image/png",
        };

        setFileData(currentFileData);
        await handleImageDownload(currentFileData);
      } catch (error) {
        console.error("Error fetching file data:", error);
        // Potentially redirect or show error message
        router.push(`/admin/uploaded-views/${userId}`);
      } finally {
        setFetchingData(false);
      }
    }

    if (!loading && user && isAdmin && userId && workId) {
      fetchFileDataAndUser();
    }
  }, [loading, user, isAdmin, userId, workId, router]);

  const handleImageDownload = async (currentFileData: FileData) => {
    if (!currentFileData.fileUrl) {
      setDownloadingImage(false);
      setLocalImageUrl("/assets/placeholderImage.jpg"); // Fallback if no URL
      return;
    }
    try {
      setDownloadingImage(true);
      cleanupOldFiles();
      const existingImageUrl = getFileFromLocalStorage(currentFileData.fileUrl);

      if (existingImageUrl) {
        setLocalImageUrl(existingImageUrl);
        return;
      }

      const downloadedImageUrl = await downloadAndStoreFile(
        currentFileData.fileUrl,
        currentFileData.fileName,
        currentFileData.fileType
      );

      if (downloadedImageUrl) {
        setLocalImageUrl(downloadedImageUrl);
      } else {
        console.error("Failed to download image");
        setLocalImageUrl(currentFileData.fileUrl); // Fallback to original URL
      }
    } catch (error) {
      console.error("Error handling image download:", error);
      setLocalImageUrl(currentFileData.fileUrl); // Fallback to original URL
    } finally {
      setDownloadingImage(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!fileData || !userId) return;

    try {
      setUpdating(true);
      const fileDocRef = doc(db, "users", userId, "files", fileData.docId);

      const updateData: { status: string } = { status: newStatus };
      await updateDoc(fileDocRef, updateData);

      // If status is "confirmed", update user's payments
      if (newStatus === "confirmed" && fileData.amount > 0) {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
          payments: increment(fileData.amount),
        });
      }

      setFileData({ ...fileData, status: newStatus });
      setStatusDialogOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      // Add user feedback here, e.g., a toast notification
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "text-green-600 bg-green-100";
      case "disputed":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading || fetchingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!fileData) {
    // This case should ideally be handled by redirection in useEffect if data is not found
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">File data could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-blue-600">Admin Dashboard</h1>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">
                Signed in as Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <button
            onClick={() => router.push(`/admin/uploaded-views/${userId}`)} // Changed to userId
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiChevronLeft className="mr-1" /> Back to{" "}
            {displayUsername || userId}’s Images
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Display */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Image Preview
              </h3>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                {downloadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-10">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                      <span className="text-sm text-gray-600">
                        Loading image...
                      </span>
                    </div>
                  </div>
                )}
                <Image
                  src={localImageUrl || "/assets/placeholderImage.jpg"}
                  alt={fileData.fileName}
                  height={400}
                  width={400}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/assets/placeholderImage.jpg"; // Fallback image
                  }}
                  priority
                />
              </div>
              <p className="text-sm text-gray-500 mt-2 truncate">
                {fileData.fileName}
              </p>
              {localImageUrl && localImageUrl.startsWith("data:") && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Loaded from local storage
                </p>
              )}
            </div>
          </div>

          {/* File Details */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">
                  Image Details
                </h3>
                <button
                  onClick={() => setStatusDialogOpen(true)}
                  disabled={updating}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <FiEdit className="mr-2" />
                  {updating ? "Updating..." : "Change Status"}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Work ID
                  </label>
                  <div className="text-lg font-semibold text-blue-600">
                    {fileData.workId}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                      fileData.status
                    )}`}
                  >
                    {fileData.status}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Views
                  </label>
                  <div className="flex items-center text-lg font-medium text-gray-800">
                    <FiEye className="text-blue-500 mr-2" />
                    {fileData.views.toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Amount
                  </label>
                  <div className="text-lg font-semibold text-green-600">
                    {/* Assuming amount is a currency, format appropriately if needed */}
                    Ksh {fileData.amount.toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Uploaded At
                  </label>
                  <div className="text-lg text-gray-600">
                    {fileData.uploadedAt.toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    File Type
                  </label>
                  <div className="text-sm text-gray-600">
                    {fileData.fileType}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <StatusDialog
        isOpen={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        onStatusChange={handleStatusChange}
        currentStatus={fileData.status}
      />
    </div>
  );
}
