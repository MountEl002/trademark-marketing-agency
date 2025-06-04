"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import PaymentDialog from "@/components/customer/PaymentDialog";
import TransactionVerification from "@/components/customer/TransactionVerification";
import { getUserBalance } from "@/contexts/userService";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

interface PricingPlan {
  id: string;
  title: string;
  price: number;
  bgColor: string;
}

const pricingPlansData: PricingPlan[] = [
  {
    id: "Early Payment",
    title: "Early Payment",
    price: 550,
    bgColor: "bg-gradient-to-r from-slate-400 via-gray-400 to-slate-500",
  },
];

const PricingCard: React.FC<{ plan: PricingPlan }> = ({ plan }) => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [transactionId, setTransactionId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const router = useRouter();
  const { user } = useAuth();

  const handleGetStarted = async () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      router.push("/login");
      return;
    }

    setIsProcessing(true);
    try {
      // Get user's current balance
      const balance = await getUserBalance(user.uid);
      setUserBalance(balance);

      if (balance >= plan.price) {
        // If user has enough balance, show confirmation dialog
        setShowConfirmDialog(true);
      } else {
        const userDocRef = doc(db, "users", user.uid);
        const transactionsCollectionRef = collection(
          userDocRef,
          "transactions"
        );

        // Query to get current transaction count
        const transactionsQuery = query(transactionsCollectionRef);
        const transactionsSnapshot = await getDocs(transactionsQuery);
        const entryNumber = transactionsSnapshot.size + 1; // Next entry will be current size + 1

        // Calculate the transactionId based on entry number
        const calculatedTransactionId = entryNumber * 134;
        setTransactionId(calculatedTransactionId.toString());

        await setDoc(doc(transactionsCollectionRef), {
          amount: plan.price,
          time: serverTimestamp(),
          type: "Deposit",
          mpesaCode: "",
          TransactionId: calculatedTransactionId,
          status: "pending",
        });

        // Show payment dialog
        setShowPaymentDialog(true);
      }
    } catch (error) {
      console.error("Error checking user balance:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmPurchase = async () => {
    if (!user) return;

    setIsProcessing(true);
    try {
      // 1. Update user balance
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        balance: userBalance - plan.price,
      });

      // 2. Add package to user's packages collection
      const packagesCollectionRef = collection(userDocRef, "extraPackages");
      await setDoc(doc(packagesCollectionRef), {
        packageId: plan.id,
        packageName: plan.title,
        packagePrice: plan.price,
        purchasedAt: serverTimestamp(),
        status: "active",
      });

      // 3. Add transaction record
      const transactionsCollectionRef = collection(userDocRef, "transactions");
      await setDoc(doc(transactionsCollectionRef), {
        amount: plan.price,
        time: serverTimestamp(),
        type: "Package Purchase",
        description: `Purchase of ${plan.title} Package`,
        status: "completed",
      });

      // 4. Close dialog and redirect to dashboard
      setShowConfirmDialog(false);
      setShowSuccessMessage(true);
      setTimeout(() => {
        router.push("/customer/dashboards");
      }, 5000);
    } catch (error) {
      console.error("Error processing purchase:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImmediateRedirect = () => {
    setShowSuccessMessage(false);
    router.push("/customer/dashboards");
  };

  const closePaymentDialog = () => {
    setShowPaymentDialog(false);
  };

  const openVerificationDialog = () => {
    setShowPaymentDialog(false);
    setShowVerificationDialog(true);
  };

  const closeVerificationDialog = () => {
    setShowVerificationDialog(false);
    // Refresh user balance after verification
    if (user) {
      getUserBalance(user.uid).then((balance) => setUserBalance(balance));
    }
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div
        className={`
          ${plan.bgColor} text-white 
          rounded-xl shadow-lg p-6 sm:p-8 
          flex flex-col justify-between h-full
        `}
      >
        <div>
          <h3 className="text-2xl font-semibold text-center mb-4">
            {plan.title}
          </h3>
          <div className="text-center mb-6">
            <span className="text-3xl font-bold">Ksh {plan.price}</span>
            <span className="text-sm opacity-80 ml-1 text-blue-300">
              /FOREVER
            </span>
          </div>
        </div>
        <button
          onClick={handleGetStarted}
          disabled={isProcessing}
          className={`
            bg-slate-800 text-white
            w-full py-3 px-6 rounded-lg font-semibold 
            hover:opacity-90 transition-opacity duration-200
            ${isProcessing ? "opacity-70 cursor-not-allowed" : ""}
          `}
        >
          {isProcessing ? "Processing..." : "Get Started"}
        </button>
      </div>

      {/* Payment Dialog */}
      {showPaymentDialog && (
        <PaymentDialog
          amount={plan.price}
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

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Confirm Purchase</h3>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-700 mb-4">
                You are about to purchase the{" "}
                <span className="font-semibold">{plan.title}</span> package for{" "}
                <span className="font-semibold">
                  Ksh {plan.price.toLocaleString()}
                </span>
                .
              </p>
              <p className="text-gray-700 mb-6">
                Your current balance:{" "}
                <span className="font-semibold">
                  Ksh {userBalance.toLocaleString()}
                </span>
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={closeConfirmDialog}
                  className="flex-1 border border-gray-300 bg-white text-gray-700 py-2 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPurchase}
                  disabled={isProcessing}
                  className={`
                    flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600
                    ${isProcessing ? "opacity-70 cursor-not-allowed" : ""}
                  `}
                >
                  {isProcessing ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-600">Success!</h3>
              <button
                onClick={handleImmediateRedirect}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoMdClose className="w-5 h-5" />
              </button>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <IoCheckmarkDoneSharp className="text-green-500 w-8 h-8" />
                </div>
              </div>
              <p className="text-gray-700 text-center mb-4">
                Your <span className="font-semibold">{plan.title}</span> package
                has been successfully purchased!
              </p>
              <p className="text-sm text-gray-500 text-center mb-6">
                Redirecting to dashboard in 5 seconds...
              </p>
              <button
                onClick={handleImmediateRedirect}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
              >
                Go to Dashboard Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const PricingSectionPage: React.FC = () => {
  return (
    <div className="mx-auto flex items-center justify-center p-4 sm:p-8 ">
      <div className="container max-w-6xl mx-auto">
        <div className="mx-auto max-w-xl">
          {pricingPlansData.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSectionPage;
