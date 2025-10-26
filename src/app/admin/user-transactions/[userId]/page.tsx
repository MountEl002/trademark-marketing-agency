"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiChevronLeft, FiClock } from "react-icons/fi";
import LoadingScreen from "@/components/common/LoadingScreen";
import TransactionDetails from "@/components/admin/dashboard/TransactionDetails";

interface TransactionData {
  docId: string;
  TransactionId: string;
  time: Date;
  status: string;
  type: string;
  amount: number;
  mpesaCode: string;
}

export default function UserTransactionsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const resolvedParams = React.use(params);
  const userId = resolvedParams.userId;
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [userTransactions, setUserTransactions] = useState<TransactionData[]>(
    []
  );
  const [fetchingData, setFetchingData] = useState(true);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionData | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login");
      return;
    }

    async function fetchUserTransactions() {
      try {
        setFetchingData(true);

        const transactionsQuery = query(
          collection(db, "users", userId, "transactions"),
          orderBy("time", "desc")
        );
        const transactionsSnapshot = await getDocs(transactionsQuery);

        if (transactionsSnapshot.empty) {
          router.push("/admin/user-transactions");
          return;
        }

        const trnsactions: TransactionData[] = [];
        transactionsSnapshot.forEach((doc) => {
          const data = doc.data();
          trnsactions.push({
            docId: doc.id,
            TransactionId: data.TransactionId || "N/A",
            time: data.time?.toDate() || new Date(),
            status: data.status || "pending",
            type: data.type || 0,
            amount: data.amount || 0,
            mpesaCode: data.mpesaCode || "N/A",
          });
        });

        setUserTransactions(trnsactions);
      } catch (error) {
        console.error("Error fetching user files:", error);
      } finally {
        setFetchingData(false);
      }
    }

    if (!loading && user && isAdmin && userId) {
      fetchUserTransactions();
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
    return <LoadingScreen message={`Loading ${username}'s transactions`} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-6">
          <button
            onClick={() => router.push("/admin/user-transactions")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiChevronLeft className="mr-1" /> Back to all customers
            transactions
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h4 className="text-2xl font-bold text-gray-800">
              {username}’s transactions
            </h4>
            {userTransactions.length === 0 ? (
              <h4>{username}’s has not done any transactions</h4>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        M-pesa Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userTransactions.map((transaction, index) => (
                      <tr
                        key={index}
                        onClick={() => {
                          setSelectedTransaction(transaction);
                        }}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-blue-600">
                            {transaction.TransactionId}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-blue-600">
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FiClock className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500">
                              {transaction.time.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {transaction.mpesaCode}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              Ksh {transaction.amount.toLocaleString()}
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
      {selectedTransaction && (
        <TransactionDetails
          transactionData={selectedTransaction}
          userId={userId}
          username={username}
          onStatusChange={(newStatus) => {
            if (selectedTransaction) {
              // Update the selectedTransaction
              const updatedTransaction = {
                ...selectedTransaction,
                status: newStatus,
              };
              setSelectedTransaction(updatedTransaction);

              // Update the transaction in the userTransactions array
              setUserTransactions((prevTransactions) =>
                prevTransactions.map((transaction) =>
                  transaction.docId === selectedTransaction.docId
                    ? { ...transaction, status: newStatus }
                    : transaction
                )
              );
            }
          }}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}
