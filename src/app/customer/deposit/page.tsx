"use client";

import { useState } from "react";
import { collection, addDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HiOutlineX } from "react-icons/hi";
import { useAuth } from "@/contexts/AuthContext";

export default function DepositComponent() {
  const [amount, setAmount] = useState(0);
  const [completion, setCompletion] = useState(67);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  const handleAmountChange = (e: { target: { value: string } }) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(Number(value));
  };

  const handleDeposit = async () => {
    if (!amount || amount < 1 || !user) return;

    setIsLoading(true);

    try {
      const timestamp = serverTimestamp();

      const userDocRef = doc(db, "users", user.uid);
      const transactionsCollectionRef = collection(userDocRef, "transactions");

      const transactionData = {
        amount: amount,
        time: timestamp,
        type: "Deposit",
        mpesaCode: "",
        status: "pending",
      };

      const transactionRef = await addDoc(
        transactionsCollectionRef,
        transactionData
      );
      setTransactionId(transactionRef.id);

      setShowPaymentDialog(true);
    } catch (error) {
      console.error("Error processing deposit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closePaymentDialog = () => {
    setShowPaymentDialog(false);
    setAmount(0);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm w-full max-w-3xl mx-auto">
      {/* Balance and Completion Section */}
      <div className="flex justify-between items-center mb-12">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold">Ksh0.00</h2>
          <p className="text-gray-500 text-sm">Balance</p>
        </div>

        <div className="flex items-center">
          <div className="relative h-16 w-16">
            <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E6E8EB"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeDasharray={`${completion}, 100`}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-medium">
              {completion}%
            </div>
          </div>
          <div className="ml-2">
            <p className="text-gray-700 font-medium">Compleation</p>
          </div>
          <div className="ml-6 flex items-center">
            <div className="h-4 w-4 bg-green-500 rounded-sm"></div>
            <span className="ml-2 text-sm">Logs</span>
          </div>
        </div>
      </div>

      {/* Deposit Input Section */}
      <div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={handleAmountChange}
            className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          onClick={handleDeposit}
          disabled={!amount || amount < 1 || isLoading || !user}
          className={`bg-green-500 text-white px-6 py-2 rounded ${
            !amount || amount < 1 || isLoading || !user
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-green-600"
          }`}
        >
          {isLoading ? "Processing..." : "Deposit"}
        </button>
      </div>

      {/* Payment Dialog */}
      {showPaymentDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Payment Details</h3>
              <button
                onClick={closePaymentDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-3">
                <p className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">Ksh{amount.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Paybill Number:</span>
                  <span className="font-medium">5088400</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Account Number:</span>
                  <span className="font-medium">10031206003165</span>
                </p>
              </div>
              <div className="mt-6">
                <p className="text-sm text-gray-600">
                  Please make the payment using M-Pesa. After payment, your
                  transaction will be verified by an admin.
                </p>
              </div>
              <button
                onClick={closePaymentDialog}
                className="mt-6 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
