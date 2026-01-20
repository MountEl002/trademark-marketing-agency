"use client";

import { useState, useEffect } from "react";
import { toggleOfflineStatus } from "@/app/actions/super-admin";
import { useAuth } from "@/contexts/AuthContext"; // Use client-auth context
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { FIREBASE_COLLECTIONS } from "@/lib/constants";
import DevelopersCut from "@/components/admin/super-admin/DevelopersCut";

export default function SuperAdminPage() {
  const { user } = useAuth(); // We need the user to get the ID token
  const [isOffline, setIsOffline] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Real-time listener for status
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, FIREBASE_COLLECTIONS.SUPER_ADMIN_OPERATIONS, "offlineStatus"),
      (doc) => {
        if (doc.exists()) {
          setIsOffline(doc.data()?.isOffline || false);
        } else {
          setIsOffline(false); // Default
        }
      },
    );
    return () => unsub();
  }, []);

  const handleToggle = async () => {
    if (isOffline === null || !user) return;
    setIsLoading(true);
    setMessage("");

    try {
      // Get the current ID token
      const token = await user.getIdToken();

      const result = await toggleOfflineStatus(token, isOffline);

      if (result.success) {
        setMessage("Status updated successfully!");
        // State update will happen via onSnapshot
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error: any) {
      setMessage(`Unexpected error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isOffline === null) {
    return <div className="p-8">Loading status...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Super Admin Controls
      </h1>

      <DevelopersCut />

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          App Utility Controls
        </h2>

        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Offline Mode</h3>
            <p className="text-sm text-gray-500">
              When enabled, the entire application will show the "Under
              Maintenance" overlay to all users.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${isOffline ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
            >
              {isOffline ? "OFFLINE" : "ONLINE"}
            </span>

            <button
              onClick={handleToggle}
              disabled={isLoading}
              className={`px-4 py-2 rounded text-white font-medium transition-colors ${
                isOffline
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading
                ? "Updating..."
                : isOffline
                  ? "Go Online"
                  : "Go Offline"}
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded ${message.includes("Error") ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
