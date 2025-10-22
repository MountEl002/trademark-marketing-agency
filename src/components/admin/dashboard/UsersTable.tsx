"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiDollarSign,
  FiCreditCard,
} from "react-icons/fi";
import UsersTableMobile from "./UsersTableMobile";
import { useRouter } from "next/navigation";

interface User {
  userId: string;
  username: string;
  email: string;
  mobile: string;
  balance: number;
  payments: number;
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersCollectionRef = collection(db, "users");
        const usersQuery = query(usersCollectionRef, limit(10));
        const querySnapshot = await getDocs(usersQuery);

        const usersData: User[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as User;
          usersData.push({
            userId: data.userId || doc.id,
            username: data.username || "N/A",
            email: data.email || "N/A",
            mobile: data.mobile || "N/A",
            balance: typeof data.balance === "number" ? data.balance : 0,
            payments: typeof data.payments === "number" ? data.payments : 0,
          });
        });

        setUsers(usersData);

        if (querySnapshot.docs.length > 0) {
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }

        if (querySnapshot.docs.length < 10) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const loadMoreUsers = async () => {
    if (!lastVisible || !hasMore) return;

    setLoadingMore(true);
    try {
      const usersCollectionRef = collection(db, "users");
      const usersQuery = query(
        usersCollectionRef,
        startAfter(lastVisible),
        limit(10)
      );
      const querySnapshot = await getDocs(usersQuery);

      const newUsersData: User[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as User;
        newUsersData.push({
          userId: data.userId || doc.id,
          username: data.username || "N/A",
          email: data.email || "N/A",
          mobile: data.mobile || "N/A",
          balance: typeof data.balance === "number" ? data.balance : 0,
          payments: typeof data.payments === "number" ? data.payments : 0,
        });
      });

      setUsers((prevUsers) => [...prevUsers, ...newUsersData]);

      if (querySnapshot.docs.length > 0) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }

      if (querySnapshot.docs.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more users:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      user.mobile.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {isMobile ? (
            <UsersTableMobile users={filteredUsers} />
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiUser className="mr-2" /> Username
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiMail className="mr-2" /> Email
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiPhone className="mr-2" /> Mobile
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiDollarSign className="mr-2" /> Balance
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiCreditCard className="mr-2" /> Payments
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.userId}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() =>
                          router.push(`/admin/users/${user.userId}`)
                        }
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600 hover:underline">
                            {user.username}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.mobile}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.balance.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.payments.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-3 text-center text-sm text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {hasMore && !searchTerm && (
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
  );
}
