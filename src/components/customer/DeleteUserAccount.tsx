"use client";

import { useState } from "react";
import { doc, writeBatch, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiTrash2 } from "react-icons/fi";
import LoadingAnimantion from "../common/LoadingAnimantion";
import { useRouter } from "next/navigation";
import { updateAnalytics } from "@/lib/analytics";

interface DeleteUserAccountProps {
  userId: string;
  username: string;
}

export default function DeleteUserAccount({
  userId,
  username,
}: DeleteUserAccountProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteUser = async () => {
    setIsDeleting(true);

    try {
      // 1. Calculate Analytics Decrements
      const analyticsUpdate: any = { totalUsers: -1 };

      // Fetch standard packages
      const packagesRef = collection(db, "users", userId, "packages");
      const extraPackagesRef = collection(db, "users", userId, "extraPackages");

      const [packagesSnap, extraPackagesSnap] = await Promise.all([
        getDocs(packagesRef),
        getDocs(extraPackagesRef),
      ]);

      const packageNames = new Set<string>();

      packagesSnap.forEach((doc) => {
        const data = doc.data();
        if (data.packageName) packageNames.add(data.packageName);
      });

      extraPackagesSnap.forEach((doc) => {
        const data = doc.data();
        if (data.packageName) packageNames.add(data.packageName);
      });

      if (packageNames.has("Basic")) analyticsUpdate.usersWithBasicPackage = -1;
      if (packageNames.has("Silver"))
        analyticsUpdate.usersWithSilverPackage = -1;
      if (packageNames.has("Gold")) analyticsUpdate.usersWithGoldPackage = -1;
      if (packageNames.has("Early Payment"))
        analyticsUpdate.usersWithEarlyPayment = -1;
      if (packageNames.has("Premium Code"))
        analyticsUpdate.usersWithPremiumCode = -1;

      // Update analytics
      await updateAnalytics(analyticsUpdate);

      const batch = writeBatch(db);

      // Delete from referrals collection
      const referralDocRef = doc(db, "referrals", username);
      batch.delete(referralDocRef);

      // Delete from registeredUsersChats collection
      const chatDocRef = doc(db, "registeredUsersChats", userId);
      batch.delete(chatDocRef);

      // Delete from userNames collection
      const usernameDocRef = doc(db, "userNames", username);
      batch.delete(usernameDocRef);

      // Delete from users collection
      const userDocRef = doc(db, "users", userId);
      batch.delete(userDocRef);

      // Commit batch delete from Firestore
      await batch.commit();

      window.alert(
        `Successfully deleted ${username}'s account and all associated data.`,
      );
      setShowDialog(false);
      setTimeout(() => {
        router.push("/admin/users");
      }, 5000);
    } catch (error) {
      console.error("Error deleting user:", error);
      window.alert(`Failed to delete ${username}'s account. Error: ${error}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center gap-2 transition-all duration-500"
      >
        <FiTrash2 size={16} />
        Delete Account
      </button>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Account Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{username}</strong>’s
              account? This action will permanently delete all their data and
              cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDialog(false)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isDeleting ? <LoadingAnimantion /> : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
