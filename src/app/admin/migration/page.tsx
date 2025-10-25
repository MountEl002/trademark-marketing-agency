"use client";

import { useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  writeBatch,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function MigrationScript() {
  const [status, setStatus] = useState<string>("");
  const [progress, setProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const runMigration = async () => {
    setIsRunning(true);
    setStatus("Starting migration...");
    setCompleted(false);

    try {
      // Step 1: Get all users
      setStatus("Fetching all users...");
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);

      const totalUsers = usersSnapshot.size;
      setProgress({ current: 0, total: totalUsers });
      setStatus(`Found ${totalUsers} users. Processing...`);

      // Step 2: Process users in batches (Firestore batch limit is 500)
      const batchSize = 500;
      let processedCount = 0;

      for (let i = 0; i < usersSnapshot.docs.length; i += batchSize) {
        const batch = writeBatch(db);
        const batchDocs = usersSnapshot.docs.slice(i, i + batchSize);

        // Process each user in this batch
        for (const userDoc of batchDocs) {
          const userId = userDoc.id;

          // Query files subcollection for pending status
          const filesRef = collection(db, "users", userId, "files");
          const pendingQuery = query(
            filesRef,
            where("status", "==", "pending")
          );
          const pendingSnapshot = await getDocs(pendingQuery);

          const pendingCount = pendingSnapshot.size;

          // Add update to batch
          const userDocRef = doc(db, "users", userId);
          batch.update(userDocRef, {
            pendingUploadedStatusReviews: pendingCount,
          });

          processedCount++;
          setProgress({ current: processedCount, total: totalUsers });
        }

        // Commit this batch
        await batch.commit();
        setStatus(
          `Processed ${processedCount} of ${totalUsers} users (${Math.round(
            (processedCount / totalUsers) * 100
          )}%)`
        );
      }

      setStatus(
        `✅ Migration completed successfully! Updated ${totalUsers} users.`
      );
      setCompleted(true);
    } catch (error) {
      console.error("Migration error:", error);
      setStatus(
        `❌ Error during migration: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          User Migration: Add pendingUploadedStatusReviews Field
        </h2>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Warning:</strong> This script should only be run once.
                It will update all user documents in your database.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">What this does:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Fetches all users from the users collection</li>
            <li>For each user, counts files with status=“pending”</li>
            <li>Adds/updates the pendingUploadedStatusReviews field</li>
            <li>Uses batched writes for efficiency</li>
          </ul>
        </div>

        {progress.total > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>
                {progress.current} / {progress.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${(progress.current / progress.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {status && (
          <div
            className={`p-4 rounded-lg mb-4 ${
              completed
                ? "bg-green-50 text-green-800"
                : status.startsWith("❌")
                ? "bg-red-50 text-red-800"
                : "bg-blue-50 text-blue-800"
            }`}
          >
            <p className="text-sm font-medium">{status}</p>
          </div>
        )}

        <button
          onClick={runMigration}
          disabled={isRunning || completed}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
            isRunning || completed
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isRunning ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Running Migration...
            </span>
          ) : completed ? (
            "✅ Migration Completed"
          ) : (
            "Run Migration"
          )}
        </button>

        {completed && (
          <button
            onClick={() => {
              setStatus("");
              setProgress({ current: 0, total: 0 });
              setCompleted(false);
            }}
            className="w-full mt-2 py-2 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
