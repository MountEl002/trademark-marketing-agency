"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { updateDoc, doc, getDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiChevronLeft, FiEdit, FiCheck, FiX } from "react-icons/fi";
import LoadingScreen from "@/components/common/LoadingScreen";

interface TransactionData {
  docId: string;
  TransactionId: string;
  time: Date;
  status: string;
  mpesaCode: string;
  amount: number;
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

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ userId: string; docId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { userId, docId } = resolvedParams;

  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);
  const [fetchingData, setFetchingData] = useState(true);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [displayUsername, setDisplayUsername] = useState<string | null>(null);

  useEffect(() => {
    async function handleDataFetch() {
      try {
        if (!loading && (!user || !isAdmin)) {
          router.push("/login");
          return;
        }

        if (loading || !user || !isAdmin || !userId || !docId) {
          console.log("Waiting for auth/params:", {
            loading,
            user: !!user,
            isAdmin,
            userId,
            docId,
          });
          return;
        }

        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setDisplayUsername(userDocSnap.data().username || "User");
        } else {
          router.push("/admin/user-transactions");
          return;
        }

        const transactionDocRef = doc(
          db,
          "users",
          userId,
          "transactions",
          docId
        );
        const transactionDocSnap = await getDoc(transactionDocRef);
        if (!transactionDocSnap.exists()) {
          console.error(
            "Transaction not found with documentId:",
            docId,
            "for user:",
            userId
          );
          router.push(`/admin/user-transactions/${userId}`);
          return;
        }

        const data = transactionDocSnap.data();

        const currentTransactionData = {
          docId: transactionDocSnap.id,
          TransactionId: data.TransactionId || "--",
          time: data.time?.toDate() || new Date(),
          status: data.status || "pending",
          mpesaCode: data.mpesaCode || "N/A",
          amount: data.amount || 0,
        };

        setTransactionData(currentTransactionData);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
        setTransactionData(null);
        router.push(`/admin/user-transactions/${userId}`);
      } finally {
        setFetchingData(false);
      }
    }

    handleDataFetch();
  }, [loading, user, isAdmin, userId, docId, router]);

  // Alternative approach with better error handling and logging
  // useEffect(() => {
  //   let isMounted = true; // Prevent state updates if component unmounts

  //   async function fetchData() {
  //     console.log("=== Starting useEffect ===");
  //     console.log("Auth state:", { loading, user: !!user, isAdmin });
  //     console.log("Params:", { userId, docId });

  //     try {
  //       // Wait for auth to complete
  //       if (loading) {
  //         console.log("Still loading auth...");
  //         return;
  //       }

  //       // Check authentication
  //       if (!user || !isAdmin) {
  //         console.log("User not authenticated or not admin, redirecting...");
  //         if (isMounted) {
  //           setFetchingData(false);
  //         }
  //         router.push("/login");
  //         return;
  //       }

  //       // Check required params
  //       if (!userId || !docId) {
  //         console.log("Missing required parameters");
  //         if (isMounted) {
  //           setFetchingData(false);
  //         }
  //         return;
  //       }

  //       console.log("All checks passed, fetching data...");

  //       // Fetch user data
  //       const userDocRef = doc(db, "users", userId);
  //       const userDocSnap = await getDoc(userDocRef);

  //       if (!userDocSnap.exists()) {
  //         console.error("User document not found:", userId);
  //         if (isMounted) {
  //           setFetchingData(false);
  //         }
  //         router.push("/admin/user-transactions");
  //         return;
  //       }

  //       const userData = userDocSnap.data();
  //       console.log("User data retrieved:", userData);

  //       if (isMounted) {
  //         setDisplayUsername(userData.username || "User");
  //       }

  //       // Fetch transaction data
  //       const transactionDocRef = doc(
  //         db,
  //         "users",
  //         userId,
  //         "transactions",
  //         docId
  //       );
  //       const transactionDocSnap = await getDoc(transactionDocRef);

  //       if (!transactionDocSnap.exists()) {
  //         console.error("Transaction document not found:", docId);
  //         if (isMounted) {
  //           setFetchingData(false);
  //         }
  //         router.push(`/admin/user-transactions/${userId}`);
  //         return;
  //       }

  //       const transactionData = transactionDocSnap.data();
  //       console.log("Transaction data retrieved:", transactionData);

  //       const formattedData = {
  //         docId: transactionDocSnap.id,
  //         TransactionId: transactionData.TransactionId || "N/A",
  //         time: transactionData.time?.toDate() || new Date(),
  //         status: transactionData.status || "pending",
  //         mpesaCode: transactionData.mpesaCode || "Not yet provided",
  //         amount: transactionData.amount || 0,
  //       };

  //       if (isMounted) {
  //         setTransactionData(formattedData);
  //         console.log("Transaction data set successfully");
  //       }
  //     } catch (error) {
  //       console.error("Error in fetchData:", error);
  //       if (isMounted) {
  //         setTransactionData(null);
  //       }
  //     } finally {
  //       if (isMounted) {
  //         setFetchingData(false);
  //         console.log("=== fetchingData set to false ===");
  //       }
  //     }
  //   }

  //   fetchData();

  //   // Cleanup function
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [loading, user, isAdmin, userId, docId, router]);
  // console.log("Transaction Data:", transactionData);

  const handleStatusChange = async (newStatus: string) => {
    if (!transactionData || !userId) return;

    try {
      setUpdating(true);
      const fileDocRef = doc(
        db,
        "users",
        userId,
        "transactions",
        transactionData.docId
      );

      const updateData: { status: string } = { status: newStatus };
      await updateDoc(fileDocRef, updateData);

      // If status is "confirmed", update user's balance
      if (newStatus === "confirmed" && transactionData.amount > 0) {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
          balance: increment(transactionData.amount),
          pendingTransactionReviews: increment(-1),
        });
      }

      setTransactionData({ ...transactionData, status: newStatus });
      setStatusDialogOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
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
    return <LoadingScreen message="Loading Transaction Details..." />;
  }

  if (!transactionData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Transaction data could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mx-auto mb-6 max-w-xl">
          <button
            onClick={() => router.push(`/admin/user-transactions/${userId}`)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiChevronLeft className="mr-1" /> Back to{" "}
            {displayUsername || userId}’s transactions
          </button>
        </div>

        <div className="mx-auto max-w-xl">
          {/* Transaction Details */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800">
                Transaction Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Transaction ID
                  </label>
                  <div className="text-lg font-semibold text-blue-600">
                    {transactionData.TransactionId}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                      transactionData.status
                    )}`}
                  >
                    {transactionData.status}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    M-Pesa Code
                  </label>
                  <div className="flex items-center text-lg font-medium text-gray-800">
                    {transactionData.mpesaCode}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Amount
                  </label>
                  <div className="text-lg font-semibold text-green-600">
                    Ksh {transactionData.amount.toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Transacted at
                  </label>
                  <div className="text-lg text-gray-600">
                    {transactionData.time.toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => setStatusDialogOpen(true)}
                  disabled={updating}
                  className="flex items-center px-4 mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <FiEdit className="mr-2" />
                  {updating ? "Updating..." : "Change Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <StatusDialog
        isOpen={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        onStatusChange={handleStatusChange}
        currentStatus={transactionData.status}
      />
    </div>
  );
}
