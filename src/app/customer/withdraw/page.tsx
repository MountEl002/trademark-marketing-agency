"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  doc,
  serverTimestamp,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { getUserBalance, getUserPayments } from "@/contexts/userService";

interface WithdrawalDialogProps {
  amount: number;
  mpesaNumber: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const WithdrawalDialog = ({
  amount,
  mpesaNumber,
  onClose,
  onConfirm,
}: WithdrawalDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error processing withdrawal:", error);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Confirm Withdrawal</h2>
        <p className="mb-2">
          Are you sure you want to withdraw{" "}
          <span className="font-bold">Ksh{amount.toLocaleString()}</span>?
        </p>
        <p className="mb-4">
          The amount will be sent to M-Pesa number:{" "}
          <span className="font-bold">{mpesaNumber}</span>
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

interface SuccessDialogProps {
  onClose: () => void;
}

const SuccessDialog = ({ onClose }: SuccessDialogProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-green-600">
          Withdrawal Request Received
        </h2>
        <p className="mb-4">
          Your withdrawal request has been received and will be processed soon!
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function WithdrawComponent() {
  const [amount, setAmount] = useState("");
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [showWithdrawalDialog, setShowWithdrawalDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [userBalance, setUserBalance] = useState<number>(0);
  const [userPayments, setUserPayments] = useState<number>(0);

  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const balance = await getUserBalance(user.uid);
        setUserBalance(balance);
        // Fetch the user's payments
        const payments = await getUserPayments(user.uid);
        setUserPayments(payments);
      }
    };
    fetchUserData();
  }, [user?.uid]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(value);
  };

  const handleMpesaNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setMpesaNumber(value);
  };

  const handleWithdrawClick = () => {
    if (
      !amount ||
      parseInt(amount) < 1 ||
      !mpesaNumber ||
      mpesaNumber.length < 10 ||
      !user
    )
      return;
    setShowWithdrawalDialog(true);
  };

  const processWithdrawal = async () => {
    if (!amount || parseInt(amount) < 1 || !mpesaNumber || !user) return;

    setIsLoading(true);

    try {
      const timestamp = serverTimestamp();

      const userDocRef = doc(db, "users", user.uid);
      const transactionsCollectionRef = collection(userDocRef, "transactions");

      // Query to get current transaction count
      const transactionsQuery = query(transactionsCollectionRef);
      const transactionsSnapshot = await getDocs(transactionsQuery);
      const entryNumber = transactionsSnapshot.size + 1; // Next entry will be current size + 1

      // Calculate the transactionId based on entry number
      const calculatedTransactionId = entryNumber * 134;

      const transactionData = {
        amount: parseInt(amount),
        time: timestamp,
        type: "Withdrawal",
        mpesaNumber: mpesaNumber,
        TransactionId: calculatedTransactionId.toString(),
        status: "pending",
      };

      await addDoc(transactionsCollectionRef, transactionData);

      // Show success dialog
      setShowWithdrawalDialog(false);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error processing withdrawal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeWithdrawalDialog = () => {
    setShowWithdrawalDialog(false);
  };

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
    setAmount("");
    setMpesaNumber("");
  };

  return (
    <div className="h-fit min-w-full vertical">
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm w-full max-w-3xl mx-auto mb-12">
        {/* Balance and Logs Section */}
        <div className="flex justify-between items-center mb-12">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xl font-semibold">
                Ksh {userBalance.toLocaleString()}
              </p>
              <p className="text-gray-500 text-sm">Balance</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xl font-semibold">
                Ksh {userPayments.toLocaleString()}
              </p>
              <p className="text-gray-500 text-sm">Payments</p>
            </div>
          </div>

          <Link
            href="/customer/all-transactions"
            className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-sm hover:bg-green-600 transition-all duration-500"
          >
            Logs
          </Link>
        </div>

        {/* Withdrawal Form Section */}
        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            Withdrawal charges apply per the normal tariffs
          </p>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter amount"
              value={amount}
              onChange={handleAmountChange}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-green-500 mb-3"
            />

            <input
              type="text"
              placeholder="Enter M-Pesa Number"
              value={mpesaNumber}
              onChange={handleMpesaNumberChange}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <button
            onClick={handleWithdrawClick}
            disabled={
              !amount ||
              parseInt(amount) < 1 ||
              !mpesaNumber ||
              mpesaNumber.length < 10 ||
              isLoading ||
              !user
            }
            className={`bg-green-500 text-white px-6 py-2 rounded ${
              !amount ||
              parseInt(amount) < 1 ||
              !mpesaNumber ||
              mpesaNumber.length < 10 ||
              isLoading ||
              !user
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-600"
            }`}
          >
            {isLoading ? "Processing..." : "Withdraw"}
          </button>
        </div>

        {/* Withdrawal Dialog */}
        {showWithdrawalDialog && (
          <WithdrawalDialog
            amount={parseInt(amount)}
            mpesaNumber={mpesaNumber}
            onClose={closeWithdrawalDialog}
            onConfirm={processWithdrawal}
          />
        )}

        {/* Success Dialog */}
        {showSuccessDialog && <SuccessDialog onClose={closeSuccessDialog} />}
      </div>
    </div>
  );
}
