"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import React from "react"; // Import React for React.use()
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  Timestamp, // Import Timestamp type from Firebase
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiChevronLeft,
  FiEdit,
  FiCheck,
  FiX,
} from "react-icons/fi";

interface UserData {
  userId: string;
  username: string;
  email: string;
  mobile: string;
  country: string;
  balance: number;
  payments: number;
  createdAt?: Timestamp; // Use Firebase Timestamp type instead of any
}

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function AlertDialog({
  isOpen,
  title,
  message,
  onClose,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  // Unwrap the params Promise using React.use()
  const resolvedParams = React.use(params);
  const username = resolvedParams.username;

  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [fetchingData, setFetchingData] = useState(true);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [newBalance, setNewBalance] = useState("");
  const [newPayments, setNewPayments] = useState("");

  // Dialog states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login");
      return;
    }

    async function fetchUserData() {
      try {
        setFetchingData(true);
        // First try to find the user by username
        const userNameQuery = query(
          collection(db, "userNames"),
          where("__name__", "==", username)
        );
        const userNameSnap = await getDocs(userNameQuery);

        if (userNameSnap.empty) {
          // Username not found
          console.error("Username not found:", username);
          router.push("/admin/users");
          return;
        }

        const userId = userNameSnap.docs[0].data().userId;
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          console.error("User document not found for userId:", userId);
          router.push("/admin/users");
          return;
        }

        const data = userDocSnap.data() as UserData;
        setUserData(data);
        setNewBalance(data.balance.toString());
        setNewPayments(data.payments.toString());
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setFetchingData(false);
      }
    }

    if (!loading && user && isAdmin) {
      fetchUserData();
    }
  }, [loading, user, isAdmin, username, router]);

  const handleSave = () => {
    if (!userData) return;

    // Validate input
    const balanceValue = parseFloat(newBalance);
    const paymentsValue = parseFloat(newPayments);

    if (isNaN(balanceValue) || isNaN(paymentsValue)) {
      setDialogMessage("Please enter valid numbers for balance and payments.");
      setAlertDialogOpen(true);
      return;
    }

    // Open confirmation dialog
    setDialogMessage(
      `Are you sure you want to update this user's balance to ${balanceValue.toFixed(
        2
      )} and payments to ${paymentsValue.toFixed(2)}?`
    );
    setConfirmDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    try {
      if (!userData) return;

      const balanceValue = parseFloat(newBalance);
      const paymentsValue = parseFloat(newPayments);

      // Update the user document
      const userDocRef = doc(db, "users", userData.userId);
      await updateDoc(userDocRef, {
        balance: balanceValue,
        payments: paymentsValue,
      });

      // Update local state
      setUserData({
        ...userData,
        balance: balanceValue,
        payments: paymentsValue,
      });

      setIsEditing(false);
      setConfirmDialogOpen(false);

      // Show success message
      setDialogMessage("User has been updated successfully.");
      setAlertDialogOpen(true);
    } catch (error) {
      console.error("Error updating user:", error);
      setConfirmDialogOpen(false);
      setDialogMessage(
        "An error occurred while updating the user. Please try again."
      );
      setAlertDialogOpen(true);
    }
  };

  if (loading || fetchingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-blue-600">Admin Dashboard</h1>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">
                Signed in as Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiChevronLeft className="mr-1" /> Back to Users
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiEdit className="mr-2" /> Edit User
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <FiX className="mr-2" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FiCheck className="mr-2" /> Save
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Username
                  </label>
                  <div className="text-lg font-medium flex items-center">
                    <FiUser className="text-blue-500 mr-2" />{" "}
                    {userData.username}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <div className="text-lg flex items-center">
                    <FiMail className="text-blue-500 mr-2" /> {userData.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Mobile
                  </label>
                  <div className="text-lg flex items-center">
                    <FiPhone className="text-blue-500 mr-2" /> {userData.mobile}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Country
                  </label>
                  <div className="text-lg">{userData.country}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Balance
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                      step="0.01"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-green-600">
                      {userData.balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Payments
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPayments}
                      onChange={(e) => setNewPayments(e.target.value)}
                      step="0.01"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-blue-600">
                      {userData.payments.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  )}
                </div>

                {userData.createdAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Created At
                    </label>
                    <div className="text-lg text-gray-600">
                      {userData.createdAt.toDate().toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        title="Confirm Changes"
        message={dialogMessage}
        onConfirm={handleConfirmSave}
        onCancel={() => setConfirmDialogOpen(false)}
      />

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertDialogOpen}
        title="Notification"
        message={dialogMessage}
        onClose={() => setAlertDialogOpen(false)}
      />
    </div>
  );
}
