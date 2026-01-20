"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
  getCountFromServer,
} from "firebase/firestore";
import { FIREBASE_COLLECTIONS } from "@/lib/constants";
import { FaSync, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function UpdateAnalytics() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  const updateAnalytics = async () => {
    setLoading(true);
    setProgress(0);
    setTotal(0);
    setStatus("Fetching users...");
    setMessage("");

    try {
      // 1. Get all users
      const usersRef = collection(db, FIREBASE_COLLECTIONS.USERS);
      const usersSnapshot = await getDocs(usersRef);
      const userDocs = usersSnapshot.docs;
      const totalUsers = userDocs.length;
      setTotal(totalUsers);

      // Initialize counters
      let countBasic = 0;
      let countSilver = 0;
      let countGold = 0;
      let countEarly = 0;
      let countPremium = 0;

      // 2. Process users in batches
      const BATCH_SIZE = 20;

      for (let i = 0; i < totalUsers; i += BATCH_SIZE) {
        const batch = userDocs.slice(i, i + BATCH_SIZE);
        setStatus(
          `Processing users ${i + 1} to ${Math.min(i + BATCH_SIZE, totalUsers)} of ${totalUsers}...`,
        );

        await Promise.all(
          batch.map(async (userDoc) => {
            const userId = userDoc.id;

            // Fetch packages for this user
            const packagesRef = collection(
              db,
              FIREBASE_COLLECTIONS.USERS,
              userId,
              "packages",
            );
            const extraPackagesRef = collection(
              db,
              FIREBASE_COLLECTIONS.USERS,
              userId,
              "extraPackages",
            );

            const [packagesSnap, extraPackagesSnap] = await Promise.all([
              getDocs(packagesRef),
              getDocs(extraPackagesRef),
            ]);

            const packageNames = new Set<string>();

            packagesSnap.forEach((pDoc) => {
              const data = pDoc.data();
              if (data.packageName) {
                packageNames.add(data.packageName);
              }
            });

            extraPackagesSnap.forEach((pDoc) => {
              const data = pDoc.data();
              if (data.packageName) {
                packageNames.add(data.packageName);
              }
            });

            if (packageNames.has("Basic")) countBasic++;
            if (packageNames.has("Silver")) countSilver++;
            if (packageNames.has("Gold")) countGold++;
            if (packageNames.has("Early Payment")) countEarly++;
            if (packageNames.has("Premium Code")) countPremium++;
          }),
        );

        setProgress(Math.min(i + BATCH_SIZE, totalUsers));
      }

      // 3. Update User Analytics
      setStatus("Updating database...");
      const analyticsRef = doc(
        db,
        FIREBASE_COLLECTIONS.COUNTERS,
        "userAnalytics",
      );
      await updateDoc(analyticsRef, {
        totalUsers: totalUsers,
        usersWithBasicPackage: countBasic,
        usersWithSilverPackage: countSilver,
        usersWithGoldPackage: countGold,
        usersWithEarlyPayment: countEarly,
        usersWithPremiumCode: countPremium,
      });

      setMessage("Analytics updated successfully!");
      setStatus("Completed");
    } catch (error: any) {
      console.error("Error updating analytics:", error);
      setMessage(`Error: ${error.message}`);
      setStatus("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Analytics Operations
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          Run a bulk update to recalculate user statistics and package counts.
          This operation reads all users and their packages.
        </p>

        {loading && (
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${total > 0 ? (progress / total) * 100 : 0}%` }}
            ></div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">
            {status || (loading ? "Initializing..." : "Ready")}
          </span>
          <button
            onClick={updateAnalytics}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded text-white font-medium transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? <FaSync className="animate-spin" /> : <FaSync />}
            {loading ? "Updating..." : "Update Analytics"}
          </button>
        </div>

        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded text-sm ${message.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
          >
            {message.includes("Error") ? (
              <FaExclamationTriangle />
            ) : (
              <FaCheckCircle />
            )}
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
