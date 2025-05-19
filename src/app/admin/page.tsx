"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaSearch, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import LoadingAnimation from "@/components/common/LoadingAnimantion";
import AdminHeader from "@/components/admin/dashboard/AdminHeaders";

interface User {
  userId: string;
  username: string;
  mobile: string;
  email: string;
  createdAt: { toDate: () => Date };
  balance: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [firstVisible, setFirstVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format balance for display
  const formatBalance = (balance: number): string => {
    return balance.toLocaleString("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Function to fetch users
  const fetchUsers = useCallback(
    async (direction: "next" | "prev" | "first" = "first") => {
      setLoading(true);
      try {
        let usersQuery;

        if (searchQuery) {
          // Search by username - case sensitive as shown in Firebase
          usersQuery = query(
            collection(db, "users"),
            where("username", ">=", searchQuery),
            where("username", "<=", searchQuery + "\uf8ff"),
            limit(pageSize)
          );
        } else {
          // Regular pagination
          if (direction === "next" && lastVisible) {
            usersQuery = query(
              collection(db, "users"),
              orderBy("createdAt", "desc"),
              startAfter(lastVisible),
              limit(pageSize)
            );
            setCurrentPage(currentPage + 1);
          } else if (direction === "prev" && firstVisible) {
            // For previous page, we need to get documents before the first visible
            // This is a simplification - ideal implementation would store page state
            const snapshot = await getDocs(
              query(
                collection(db, "users"),
                orderBy("createdAt", "desc"),
                limit((currentPage - 1) * pageSize)
              )
            );

            const docs = snapshot.docs;
            const startIdx = Math.max(0, docs.length - pageSize);
            usersQuery = query(
              collection(db, "users"),
              orderBy("createdAt", "desc"),
              limit(pageSize)
            );

            if (docs.length > 0) {
              setFirstVisible(docs[startIdx]);
              setLastVisible(docs[docs.length - 1]);
            }

            setCurrentPage(currentPage - 1);
            setHasMore(true);

            // Get the actual page data
            const pageData = await getDocs(usersQuery);
            const userData = pageData.docs.map((doc) => ({
              ...doc.data(),
              userId: doc.id,
            })) as User[];

            setUsers(userData);
            setLoading(false);
            return;
          } else {
            // First page
            usersQuery = query(
              collection(db, "users"),
              orderBy("createdAt", "desc"),
              limit(pageSize)
            );
            setCurrentPage(1);
          }
        }

        const snapshot = await getDocs(usersQuery);
        const docs = snapshot.docs;

        if (docs.length > 0) {
          setFirstVisible(docs[0]);
          setLastVisible(docs[docs.length - 1]);
          setHasMore(docs.length === pageSize);
        } else {
          setHasMore(false);
        }

        const userData = docs.map((doc) => ({
          ...doc.data(),
          userId: doc.id,
        })) as User[];

        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, pageSize, lastVisible, firstVisible, currentPage]
  );

  // Effect to fetch users on component mount and when dependencies change
  useEffect(() => {
    fetchUsers("first");
  }, [fetchUsers, pageSize, searchQuery]);

  // Handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value));
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers("first");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
          User Management
        </h1>

        {/* Search and pagination controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center">
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 entries per page</option>
              <option value={10}>10 entries per page</option>
              <option value={25}>25 entries per page</option>
              <option value={50}>50 entries per page</option>
            </select>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <FaSearch />
            </button>
          </form>
        </div>

        {/* Users table */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <LoadingAnimation className="mr-3" />
                        <span>Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No entries found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.userId}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {user.username || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {user.mobile || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {user.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {user.createdAt
                          ? formatDate(user.createdAt.toDate())
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {user.balance !== undefined
                          ? formatBalance(user.balance)
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => fetchUsers("prev")}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <FaAngleLeft className="text-sm" />
              </button>
              <button
                onClick={() => fetchUsers("next")}
                disabled={!hasMore}
                className={`px-3 py-1 rounded-md ${
                  !hasMore
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <FaAngleRight className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
