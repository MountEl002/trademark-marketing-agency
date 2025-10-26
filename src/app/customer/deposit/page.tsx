"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  doc,
  serverTimestamp,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import TransactionVerification from "@/components/customer/TransactionVerification";
import PaymentDialog from "@/components/customer/PaymentDialog";
import { getUserBalance } from "@/contexts/userService";

export default function DepositComponent() {
  const [amount, setAmount] = useState(0);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [userBalance, setUserBalance] = useState<number>(0);

  const [transactionId, setTransactionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const balance = await getUserBalance(user.uid);
        setUserBalance(balance);
      }
    };
    fetchUserData();
  }, [user?.uid]);

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

      // Calculate the transactionId based on entry number
      const calculatedTransactionId = Date.now();

      const transactionData = {
        amount: amount,
        time: timestamp,
        type: "Deposit",
        mpesaCode: "",
        TransactionId: calculatedTransactionId.toString(),
        status: "pending",
      };

      await addDoc(transactionsCollectionRef, transactionData);

      updateDoc(userDocRef, {
        pendingTransactionReviews: increment(1),
        latestPendingTransactionDate: timestamp,
        latestTransactionId: calculatedTransactionId.toString(),
      });

      setTransactionId(calculatedTransactionId.toString());

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

  const openVerificationDialog = () => {
    setShowPaymentDialog(false);
    setShowVerificationDialog(true);
  };

  const closeVerificationDialog = () => {
    setShowVerificationDialog(false);
    setAmount(0);
  };

  return (
    <div className="min-h-screen min-w-full vertical">
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm w-full max-w-3xl mx-auto">
        {/* Balance and Completion Section */}
        <div className="flex min-[450px]:justify-between flex-col min-[450px]:flex-row justify-start items-start min-[450px]:items-center mb-12">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-xl font-semibold min-[450px]:mb-0 mb-2">
              Ksh {userBalance.toLocaleString()}
            </p>
            <p className="text-gray-500 text-sm">Balance</p>
          </div>

          <Link
            href="/customer/all-transactions"
            className="bg-green-500 text-white px-6 py-2 min-[450px]:mt-0 mt-6 rounded-lg shadow-sm hover:bg-green-600 transition-all duration-500"
          >
            Logs/Verify pending transactions
          </Link>
        </div>

        {/* Deposit Input Section */}
        <div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={handleAmountChange}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-green-500"
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
          <PaymentDialog
            amount={amount}
            transactionId={transactionId}
            onClose={closePaymentDialog}
            onVerify={openVerificationDialog}
          />
        )}

        {/* Verification Dialog */}
        {showVerificationDialog && user && (
          <TransactionVerification
            transactionId={transactionId}
            userId={user.uid}
            onClose={closeVerificationDialog}
          />
        )}
      </div>
    </div>
  );
}
