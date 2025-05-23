"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiChevronLeft, FiImage, FiClock, FiEye } from "react-icons/fi";

interface FileData {
  workId: string;
  uploadedAt: Date;
  status: string;
  views: number;
  amount: number;
  fileName: string;
}

export default function UserUploadsPage({
  params,
}: {
  params: Promise<{ userId: string }>; // Changed from username to userId
}) {
  const resolvedParams = React.use(params);
  const userId = resolvedParams.userId; // Changed from username to userId

  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [userFiles, setUserFiles] = useState<FileData[]>([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [displayUsername, setDisplayUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login");
      return;
    }

    async function fetchUserFilesAndData() {
      try {
        setFetchingData(true);

        // Fetch user's username for display
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setDisplayUsername(userDocSnap.data().username || "User");
        } else {
          console.error("User not found:", userId);
          setDisplayUsername("Unknown User");
          // Optionally, redirect if user not found, though files might still be fetched if ID is valid for subcollection
        }

        // Get all files for this user using userId
        const filesQuery = query(
          collection(db, "users", userId, "files"),
          orderBy("uploadedAt", "desc")
        );
        const filesSnapshot = await getDocs(filesQuery);

        if (filesSnapshot.empty && !userDocSnap.exists()) {
          // If user doc doesn't exist and no files, likely invalid userId
          router.push("/admin/uploaded-views");
          return;
        }

        const files: FileData[] = [];
        filesSnapshot.forEach((doc) => {
          const data = doc.data();
          files.push({
            workId: data.workId?.toString() || "N/A",
            uploadedAt: data.uploadedAt?.toDate() || new Date(),
            status: data.status || "pending",
            views: data.views || 0,
            amount: data.amount || 0,
            fileName: data.fileName || "Unknown",
          });
        });

        setUserFiles(files);
      } catch (error) {
        console.error("Error fetching user files:", error);
      } finally {
        setFetchingData(false);
      }
    }

    if (!loading && user && isAdmin && userId) {
      fetchUserFilesAndData();
    }
  }, [loading, user, isAdmin, userId, router]);

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
            onClick={() => router.push("/admin/uploaded-views")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiChevronLeft className="mr-1" /> Back to Uploaded Views
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <FiImage className="text-blue-600 mr-3 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-800">
                Images uploaded by {displayUsername || userId}
              </h2>
            </div>

            {userFiles.length === 0 ? (
              <div className="text-center py-8">
                <FiImage className="mx-auto text-gray-400 text-6xl mb-4" />
                <p className="text-gray-500 text-lg">
                  No images found for this user.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Work ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time Uploaded
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userFiles.map((file, index) => (
                      <tr
                        key={index} // Consider using file.workId if unique and stable
                        onClick={() =>
                          router.push(
                            `/admin/uploaded-views/${userId}/${file.workId}` // Changed to userId
                          )
                        }
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-blue-600">
                            {file.workId}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FiClock className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500">
                              {file.uploadedAt.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              file.status
                            )}`}
                          >
                            {file.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FiEye className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {file.views.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              Ksh {file.amount.toLocaleString()}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
