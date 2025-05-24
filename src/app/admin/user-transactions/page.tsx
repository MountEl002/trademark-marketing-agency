"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiChevronLeft, FiClock } from "react-icons/fi";
import LoadingScreen from "@/components/common/LoadingScreen";

interface UserWithTransactions {
  userId: string;
  username: string;
  latestTransactionTime: Date;
}

export default function UserTransactionsPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [usersWithTransactions, setUsersWithTransactions] = useState<
    UserWithTransactions[]
  >([]);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login");
      return;
    }

    async function fetchusersWithTransactions() {
      try {
        setFetchingData(true);
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersWithTransactions: UserWithTransactions[] = [];

        for (const userDoc of usersSnapshot.docs) {
          const userData = userDoc.data();
          const userId = userDoc.id;
          const username = userData.username;

          if (!username) continue;
          const transactionsQuery = query(
            collection(db, "users", userId, "transactions"),
            orderBy("time", "desc"),
            limit(1)
          );
          const transactionsSnapshot = await getDocs(transactionsQuery);

          if (!transactionsSnapshot.empty) {
            const latesttransaction = transactionsSnapshot.docs[0].data();
            const time = latesttransaction.time?.toDate() || new Date();

            usersWithTransactions.push({
              userId,
              username,
              latestTransactionTime: time,
            });
          }
        }

        usersWithTransactions.sort(
          (a, b) =>
            b.latestTransactionTime.getTime() -
            a.latestTransactionTime.getTime()
        );
        setUsersWithTransactions(usersWithTransactions);
      } catch (error) {
        console.error("Error fetching users with transactions:", error);
      } finally {
        setFetchingData(false);
      }
    }

    if (!loading && user && isAdmin) {
      fetchusersWithTransactions();
    }
  }, [loading, user, isAdmin, router]);

  if (loading || fetchingData) {
    return <LoadingScreen message="Loading Transactions" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-6">
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiChevronLeft className="mr-1" /> Go back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h4>Users with uploaded images</h4>

            {usersWithTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  No users have transacted yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Latest Transaction Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usersWithTransactions.map((u) => (
                      <tr
                        key={u.userId}
                        onClick={() =>
                          router.push(`/admin/user-transactions/${u.userId}`)
                        }
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {u.username}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FiClock className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500">
                              {u.latestTransactionTime.toLocaleString()}
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
