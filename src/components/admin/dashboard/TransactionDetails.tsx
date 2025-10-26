"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import {
  updateDoc,
  doc,
  increment,
  Timestamp,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiEdit, FiCheck, FiX } from "react-icons/fi";
import LoadingScreen from "@/components/common/LoadingScreen";
import LoadingAnimantion from "@/components/common/LoadingAnimantion";

interface TransactionData {
  docId: string;
  TransactionId: string;
  time: Date;
  status: string;
  mpesaCode: string;
  amount: number;
}

interface TransactionDetailsProps {
  transactionData: TransactionData;
  userId: string;
  username: string | null;
  onStatusChange: (status: string) => void;
  onClose?: () => void;
}

interface StatusDialogProps {
  isOpen: boolean;
  statusUpdateInProgress: boolean;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  currentStatus: string;
}

function StatusDialog({
  isOpen,
  statusUpdateInProgress,
  onClose,
  onStatusChange,
  currentStatus,
}: StatusDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
        {statusUpdateInProgress ? (
          <div className="w-full h-full flex flex-row items-center justify-center">
            <LoadingAnimantion text="Status update in progress..." />
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Change Status
            </h3>
            <p className="text-gray-600 mb-6">
              Current status:{" "}
              <span className="font-medium">{currentStatus}</span>
            </p>

            <div className="space-y-3">
              <button
                onClick={() => onStatusChange("confirmed")}
                disabled={statusUpdateInProgress}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiCheck className="mr-2" />
                Mark as Confirmed
              </button>
              <button
                onClick={() => onStatusChange("disputed")}
                disabled={statusUpdateInProgress}
                className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FiX className="mr-2" />
                Mark as Disputed
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                disabled={statusUpdateInProgress}
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function TransactionDetails({
  transactionData,
  userId,
  onStatusChange,
  onClose,
}: TransactionDetailsProps) {
  const { loading } = useAuth();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

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

      const userDocRef = doc(db, "users", userId);

      // If status is "confirmed", update user's balance
      if (newStatus === "confirmed" && transactionData.amount > 0) {
        await updateDoc(userDocRef, {
          balance: increment(transactionData.amount),
        });
      }

      // Query transaction subcollection for pending status
      const transactionsRef = collection(db, "users", userId, "transactions");
      const newPendingQuery = query(
        transactionsRef,
        where("status", "==", "pending")
      );
      const newPendingSnapshot = await getDocs(newPendingQuery);

      // Find the latest pending transaction date
      let latestPendingTimestamp: Timestamp | null = null;
      newPendingSnapshot.forEach((transDoc) => {
        const transData = transDoc.data();
        const transTime = transData.time;

        // Check if transTime is a Firestore Timestamp
        if (transTime instanceof Timestamp) {
          if (
            !latestPendingTimestamp ||
            transTime.toMillis() > latestPendingTimestamp.toMillis()
          ) {
            latestPendingTimestamp = transTime;
          }
        }
      });

      const pendingCount = newPendingSnapshot.size;

      updateDoc(userDocRef, {
        pendingTransactionReviews: pendingCount,
        latestPendingTransactionDate: latestPendingTimestamp || null,
      });

      onStatusChange?.(newStatus);
      setStatusDialogOpen(false);

      setTimeout(() => {
        onClose?.();
      }, 1500);
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

  if (loading) {
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
    <div className="fixed inset-0 z-50 min-h-screen flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Transaction Details */}
      <div className="bg-white relative rounded-lg shadow overflow-hidden w-full max-w-xl">
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
        <button
          onClick={onClose}
          disabled={updating}
          className="absolute right-4 top-7 flex items-center text-blue-600 font-bold hover:bg-blue-600 hover:text-gray-100 rounded-lg p-2 transition-all duration-500"
        >
          Close
        </button>
      </div>
      <StatusDialog
        isOpen={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        onStatusChange={handleStatusChange}
        currentStatus={transactionData.status}
        statusUpdateInProgress={updating}
      />
    </div>
  );
}
