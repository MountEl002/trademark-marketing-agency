"use client";

import { useState } from "react";
import {
  doc,
  collection,
  where,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HiOutlineX } from "react-icons/hi";

interface VerificationProps {
  transactionId: string;
  userId: string;
  onClose: () => void;
}

export default function TransactionVerification({
  transactionId,
  userId,
  onClose,
}: VerificationProps) {
  const [mpesaCode, setMpesaCode] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyTransaction = async () => {
    if (!mpesaCode || !transactionId || !userId) {
      setVerificationMessage("Please enter an M-Pesa code");
      return;
    }

    setIsVerifying(true);
    setVerificationMessage("");

    try {
      const userDocRef = doc(db, "users", userId);
      const transactionsCollectionRef = collection(userDocRef, "transactions");

      // Query to find the transaction with the matching TransactionId
      const transactionQuery = query(
        transactionsCollectionRef,
        where("TransactionId", "==", transactionId)
      );

      const querySnapshot = await getDocs(transactionQuery);

      if (querySnapshot.empty) {
        setVerificationMessage(
          "Transaction not found. Please check the ID and try again."
        );
        setIsVerifying(false);
        return;
      }

      // Update the transaction with the M-Pesa code and change status to "verifying"
      const transactionDoc = querySnapshot.docs[0];
      await updateDoc(transactionDoc.ref, {
        mpesaCode: mpesaCode,
        status: "verifying",
      });

      setVerificationMessage(
        "Verification request received. Your transaction will be processed as soon as possible."
      );
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error verifying transaction:", error);
      setVerificationMessage("An error occurred. Please try again later.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Verify Transaction</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="transactionId"
                className="block text-gray-600 mb-1"
              >
                Transaction ID
              </label>
              <input
                id="transactionId"
                type="text"
                value={transactionId}
                readOnly
                className="w-full border border-gray-300 rounded p-3 bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="mpesaCode" className="block text-gray-600 mb-1">
                M-Pesa Code
              </label>
              <input
                id="mpesaCode"
                type="text"
                value={mpesaCode}
                onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
                placeholder="e.g. PXL123456"
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            {verificationMessage && (
              <div
                className={`p-3 rounded ${
                  verificationMessage.includes("error") ||
                  verificationMessage.includes("not found")
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {verificationMessage}
              </div>
            )}

            <button
              onClick={handleVerifyTransaction}
              disabled={isVerifying || !mpesaCode}
              className={`mt-4 w-full bg-green-500 text-white py-2 rounded ${
                isVerifying || !mpesaCode
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-600"
              }`}
            >
              {isVerifying ? "Verifying..." : "Submit Verification"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
