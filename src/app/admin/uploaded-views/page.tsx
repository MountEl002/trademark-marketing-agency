"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiChevronLeft, FiImage, FiClock } from "react-icons/fi";

interface UserWithUploads {
  userId: string;
  username: string;
  latestUploadTime: Date;
}

export default function UploadedViewsPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [usersWithUploads, setUsersWithUploads] = useState<UserWithUploads[]>(
    []
  );
  const [fetchingData, setFetchingData] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login");
      return;
    }

    async function fetchUsersWithUploads() {
      try {
        setFetchingData(true);
        const usersQuery = query(
          collection(db, "users"),
          where("pendingUploadedStatusReviews", ">", 0),
          limit(5)
        );
        const usersSnapshot = await getDocs(usersQuery);
        const usersWithFiles: UserWithUploads[] = [];

        for (const userDoc of usersSnapshot.docs) {
          const userData = userDoc.data();
          const userId = userDoc.id;
          const username = userData.username;

          if (!username) continue;

          const filesQuery = query(
            collection(db, "users", userId, "files"),
            orderBy("uploadedAt", "desc"),
            limit(1)
          );
          const filesSnapshot = await getDocs(filesQuery);

          if (!filesSnapshot.empty) {
            const latestFile = filesSnapshot.docs[0].data();
            const uploadedAt = latestFile.uploadedAt?.toDate() || new Date();

            usersWithFiles.push({
              userId,
              username,
              latestUploadTime: uploadedAt,
            });
          }
        }

        usersWithFiles.sort(
          (a, b) => b.latestUploadTime.getTime() - a.latestUploadTime.getTime()
        );
        setUsersWithUploads(usersWithFiles);

        if (usersSnapshot.docs.length > 0) {
          setLastVisible(usersSnapshot.docs[usersSnapshot.docs.length - 1]);
        }

        if (usersSnapshot.docs.length < 5) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching users with uploads:", error);
      } finally {
        setFetchingData(false);
      }
    }

    if (!loading && user && isAdmin) {
      fetchUsersWithUploads();
    }
  }, [loading, user, isAdmin, router]);

  const loadMoreUsers = async () => {
    if (!lastVisible || !hasMore) return;

    setLoadingMore(true);
    try {
      const usersQuery = query(
        collection(db, "users"),
        startAfter(lastVisible),
        limit(5)
      );
      const usersSnapshot = await getDocs(usersQuery);
      const newUsersWithFiles: UserWithUploads[] = [];

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userId = userDoc.id;
        const username = userData.username;

        if (!username) continue;

        const filesQuery = query(
          collection(db, "users", userId, "files"),
          orderBy("uploadedAt", "desc"),
          limit(1)
        );
        const filesSnapshot = await getDocs(filesQuery);

        if (!filesSnapshot.empty) {
          const latestFile = filesSnapshot.docs[0].data();
          const uploadedAt = latestFile.uploadedAt?.toDate() || new Date();

          newUsersWithFiles.push({
            userId,
            username,
            latestUploadTime: uploadedAt,
          });
        }
      }

      newUsersWithFiles.sort(
        (a, b) => b.latestUploadTime.getTime() - a.latestUploadTime.getTime()
      );
      setUsersWithUploads((prevUsers) => [...prevUsers, ...newUsersWithFiles]);

      if (usersSnapshot.docs.length > 0) {
        setLastVisible(usersSnapshot.docs[usersSnapshot.docs.length - 1]);
      }

      if (usersSnapshot.docs.length < 5) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more users:", error);
    } finally {
      setLoadingMore(false);
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
            onClick={() => router.push("/admin")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiChevronLeft className="mr-1" /> Back to Admin
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <FiImage className="text-blue-600 mr-3 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-800">
                Customers with pending uploaded status reviews
              </h2>
            </div>

            {usersWithUploads.length === 0 ? (
              <div className="text-center py-8">
                <FiImage className="mx-auto text-gray-400 text-6xl mb-4" />
                <p className="text-gray-500 text-lg">
                  No users have uploaded images yet.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Latest Upload Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {usersWithUploads.map((u) => (
                        <tr
                          key={u.userId}
                          onClick={() =>
                            router.push(
                              `/admin/uploaded-views/${
                                u.userId
                              }?username=${encodeURIComponent(u.username)}`
                            )
                          }
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FiImage className="text-blue-500 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {u.username}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FiClock className="text-gray-400 mr-2" />
                              <span className="text-sm text-gray-500">
                                {u.latestUploadTime.toLocaleString()}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {hasMore && (
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={loadMoreUsers}
                      disabled={loadingMore}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {loadingMore ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Loading...
                        </span>
                      ) : (
                        "Next"
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
