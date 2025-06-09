"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  doc,
  serverTimestamp,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { getUserBalance, getUserPayments } from "@/contexts/userService";
import { useRouter } from "next/navigation";
import LoadingAnimantion from "@/components/common/LoadingAnimantion";

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
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
            disabled={isProcessing}
          >
            {isProcessing && <LoadingAnimantion className="mr-3" />}
            {isProcessing ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

interface PendingWithdrawalDialogProps {
  onWait: () => void;
  onCancel: () => void;
  isCancelling: boolean;
}

const PendingWithdrawalDialog = ({
  onWait,
  onCancel,
  isCancelling,
}: PendingWithdrawalDialogProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Pending Withdrawal</h2>
        <p className="mb-4">
          You have a pending withdrawal request. Please wait for it to be
          processed or cancel it.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onWait}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            disabled={isCancelling}
          >
            Wait
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
            disabled={isCancelling}
          >
            {isCancelling && <LoadingAnimantion className="mr-3" />}
            {isCancelling ? "Cancelling..." : "Cancel Withdrawal"}
          </button>
        </div>
      </div>
    </div>
  );
};

interface AccountSelectionDialogProps {
  onSelectBalance: () => void;
  onSelectPayments: () => void;
  onClose: () => void;
}

const AccountSelectionDialog = ({
  onSelectBalance,
  onSelectPayments,
  onClose,
}: AccountSelectionDialogProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Select Withdrawal Account
        </h2>
        <p className="mb-4">Choose which account to withdraw from:</p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onSelectBalance}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Balance Account
          </button>
          <button
            onClick={onSelectPayments}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Payments Account
          </button>
        </div>
      </div>
    </div>
  );
};

interface InsufficientBalanceDialogProps {
  message: string;
  onClose: () => void;
}

const InsufficientBalanceDialog = ({
  message,
  onClose,
}: InsufficientBalanceDialogProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-red-600">
          Withdrawal Declined
        </h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Close
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

interface CancellationNotificationDialogProps {
  success: boolean;
  message: string;
  onClose: () => void;
}

const CancellationNotificationDialog = ({
  success,
  message,
  onClose,
}: CancellationNotificationDialogProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2
          className={`text-xl font-semibold mb-4 ${
            success ? "text-green-600" : "text-red-600"
          }`}
        >
          {success ? "Cancellation Successful" : "Cancellation Failed"}
        </h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-white rounded-lg ${
              success
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
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
  const [showPendingDialog, setShowPendingDialog] = useState(false);
  const [showAccountSelectionDialog, setShowAccountSelectionDialog] =
    useState(false);
  const [showInsufficientBalanceDialog, setShowInsufficientBalanceDialog] =
    useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [
    showCancellationNotificationDialog,
    setShowCancellationNotificationDialog,
  ] = useState(false);
  const [isCancellingWithdrawal, setIsCancellingWithdrawal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<
    "balance" | "payments" | null
  >(null);
  const [insufficientBalanceMessage, setInsufficientBalanceMessage] =
    useState("");
  const [cancellationNotification, setCancellationNotification] = useState({
    success: false,
    message: "",
  });

  const [userBalance, setUserBalance] = useState<number>(0);
  const [userPayments, setUserPayments] = useState<number>(0);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const balance = await getUserBalance(user.uid);
        setUserBalance(balance);
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

  const checkPendingWithdrawals = async (): Promise<boolean> => {
    if (!user?.uid) return false;

    try {
      const userDocRef = doc(db, "users", user.uid);
      const transactionsCollectionRef = collection(userDocRef, "transactions");
      const pendingQuery = query(
        transactionsCollectionRef,
        where("type", "==", "Withdrawal"),
        where("status", "==", "pending")
      );

      const pendingSnapshot = await getDocs(pendingQuery);
      return !pendingSnapshot.empty;
    } catch (error) {
      console.error("Error checking pending withdrawals:", error);
      return false;
    }
  };

  const cancelPendingWithdrawals = async () => {
    if (!user?.uid) return;

    setIsCancellingWithdrawal(true);

    try {
      const userDocRef = doc(db, "users", user.uid);
      const transactionsCollectionRef = collection(userDocRef, "transactions");
      const pendingQuery = query(
        transactionsCollectionRef,
        where("type", "==", "Withdrawal"),
        where("status", "==", "pending")
      );

      const pendingSnapshot = await getDocs(pendingQuery);
      let balanceUpdated = false;
      let deletionSuccess = true;

      for (const docSnapshot of pendingSnapshot.docs) {
        const transactionData = docSnapshot.data();
        const { withdrawnFrom, amount: transactionAmount } = transactionData;

        try {
          // If withdrawnFrom field exists, update user balances
          if (withdrawnFrom) {
            if (withdrawnFrom === "balanceAccount") {
              await updateDoc(userDocRef, {
                balance: increment(transactionAmount),
                MyWithdrawals: increment(-transactionAmount),
              });
            } else if (withdrawnFrom === "paymentsAccount") {
              await updateDoc(userDocRef, {
                payments: increment(transactionAmount),
                EarningWithdrawals: increment(-transactionAmount),
              });
            }
            balanceUpdated = true;
          }

          // Delete the document
          await deleteDoc(docSnapshot.ref);
        } catch (error) {
          console.error("Error processing withdrawal cancellation:", error);
          deletionSuccess = false;
        }
      }

      // Update local balances
      if (balanceUpdated) {
        const balance = await getUserBalance(user.uid);
        setUserBalance(balance);
        const payments = await getUserPayments(user.uid);
        setUserPayments(payments);
      }

      // Set notification message
      if (deletionSuccess) {
        const message = balanceUpdated
          ? "Pending withdrawal has been successfully deleted and relevant balances have been successfully updated."
          : "Pending withdrawal has been successfully deleted.";
        setCancellationNotification({ success: true, message });
      } else {
        setCancellationNotification({
          success: false,
          message: "Failed to delete pending withdrawal. Please try again.",
        });
      }

      setShowPendingDialog(false);
      setShowCancellationNotificationDialog(true);
    } catch (error) {
      console.error("Error canceling pending withdrawals:", error);
      setCancellationNotification({
        success: false,
        message: "Failed to delete pending withdrawal. Please try again.",
      });
      setShowPendingDialog(false);
      setShowCancellationNotificationDialog(true);
    } finally {
      setIsCancellingWithdrawal(false);
    }
  };

  const handleWithdrawClick = async () => {
    if (
      !amount ||
      parseInt(amount) < 1 ||
      !mpesaNumber ||
      mpesaNumber.length < 10 ||
      !user
    )
      return;

    setIsLoading(true);

    const hasPendingWithdrawals = await checkPendingWithdrawals();

    if (hasPendingWithdrawals) {
      setIsLoading(false);
      setShowPendingDialog(true);
    } else {
      setIsLoading(false);
      setShowAccountSelectionDialog(true);
    }
  };

  const handleAccountSelection = (account: "balance" | "payments") => {
    setSelectedAccount(account);
    setShowAccountSelectionDialog(false);

    const withdrawalAmount = parseInt(amount);

    if (account === "balance") {
      if (withdrawalAmount <= userBalance) {
        setShowWithdrawalDialog(true);
      } else {
        setInsufficientBalanceMessage(
          "Insufficient balance in your balance account."
        );
        setShowInsufficientBalanceDialog(true);
      }
    } else if (account === "payments") {
      if (withdrawalAmount <= userPayments) {
        setShowWithdrawalDialog(true);
      } else {
        setInsufficientBalanceMessage(
          "Insufficient balance in your payments account."
        );
        setShowInsufficientBalanceDialog(true);
      }
    }
  };

  const processWithdrawal = async () => {
    if (
      !amount ||
      parseInt(amount) < 1 ||
      !mpesaNumber ||
      !user ||
      !selectedAccount
    )
      return;

    try {
      const timestamp = serverTimestamp();
      const userDocRef = doc(db, "users", user.uid);
      const transactionsCollectionRef = collection(userDocRef, "transactions");

      const transactionsQuery = query(transactionsCollectionRef);
      const transactionsSnapshot = await getDocs(transactionsQuery);
      const entryNumber = transactionsSnapshot.size + 1;
      const calculatedTransactionId = entryNumber * 134;

      const transactionData = {
        amount: parseInt(amount),
        time: timestamp,
        type: "Withdrawal",
        mpesaNumber: mpesaNumber,
        TransactionId: calculatedTransactionId.toString(),
        status: "pending",
        withdrawnFrom:
          selectedAccount === "balance" ? "balanceAccount" : "paymentsAccount",
      };

      await addDoc(transactionsCollectionRef, transactionData);

      // Update user document with withdrawal amount and deduct from account balance
      if (selectedAccount === "payments") {
        await updateDoc(userDocRef, {
          EarningWithdrawals: increment(parseInt(amount)),
          payments: increment(-parseInt(amount)),
        });
        const payments = await getUserPayments(user.uid);
        setUserPayments(payments);
      } else {
        await updateDoc(userDocRef, {
          MyWithdrawals: increment(parseInt(amount)),
          balance: increment(-parseInt(amount)),
        });
        const balance = await getUserBalance(user.uid);
        setUserBalance(balance);
      }

      setShowWithdrawalDialog(false);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error processing withdrawal:", error);
    }
  };

  const handlePendingWait = () => {
    router.push("/");
  };

  const handlePendingCancel = () => {
    cancelPendingWithdrawals();
  };

  const closeWithdrawalDialog = () => {
    setShowWithdrawalDialog(false);
    setSelectedAccount(null);
  };

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
    setAmount("");
    setMpesaNumber("");
    setSelectedAccount(null);
  };

  const closeInsufficientBalanceDialog = () => {
    setShowInsufficientBalanceDialog(false);
    setSelectedAccount(null);
  };

  const closeAccountSelectionDialog = () => {
    setShowAccountSelectionDialog(false);
  };

  const closeCancellationNotificationDialog = () => {
    setShowCancellationNotificationDialog(false);
  };

  return (
    <div className="h-fit min-w-full vertical">
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm w-full max-w-3xl mx-auto mb-12">
        {/* Balance and Logs Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
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
          <div className="flex items-center justify-items-start sm:justify-center">
            <Link
              href="/customer/all-transactions"
              className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-sm hover:bg-green-600 transition-all duration-500"
            >
              Transaction logs
            </Link>
          </div>
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
            className={`bg-green-500 text-white px-6 py-2 rounded flex items-center gap-2 ${
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
            {isLoading && <LoadingAnimantion className="mr-3" />}
            {isLoading ? "Processing..." : "Withdraw"}
          </button>
        </div>

        {/* Dialogs */}
        {showPendingDialog && (
          <PendingWithdrawalDialog
            onWait={handlePendingWait}
            onCancel={handlePendingCancel}
            isCancelling={isCancellingWithdrawal}
          />
        )}

        {showAccountSelectionDialog && (
          <AccountSelectionDialog
            onSelectBalance={() => handleAccountSelection("balance")}
            onSelectPayments={() => handleAccountSelection("payments")}
            onClose={closeAccountSelectionDialog}
          />
        )}

        {showInsufficientBalanceDialog && (
          <InsufficientBalanceDialog
            message={insufficientBalanceMessage}
            onClose={closeInsufficientBalanceDialog}
          />
        )}

        {showWithdrawalDialog && (
          <WithdrawalDialog
            amount={parseInt(amount)}
            mpesaNumber={mpesaNumber}
            onClose={closeWithdrawalDialog}
            onConfirm={processWithdrawal}
          />
        )}

        {showSuccessDialog && <SuccessDialog onClose={closeSuccessDialog} />}

        {showCancellationNotificationDialog && (
          <CancellationNotificationDialog
            success={cancellationNotification.success}
            message={cancellationNotification.message}
            onClose={closeCancellationNotificationDialog}
          />
        )}
      </div>
    </div>
  );
}
