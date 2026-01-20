"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, Timestamp } from "firebase/firestore";
import { FIREBASE_COLLECTIONS } from "@/lib/constants";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { MdWarning } from "react-icons/md";

interface DevelopersCutData {
  amount: number;
  updatedOn?: Timestamp;
}

export default function DevelopersCut() {
  const [data, setData] = useState<DevelopersCutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, FIREBASE_COLLECTIONS.COUNTERS, "developersCut"),
      (docSnap) => {
        if (docSnap.exists()) {
          setData(docSnap.data() as DevelopersCutData);
        } else {
          setData({ amount: 0 });
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching developers cut:", error);
        setLoading(false);
      },
    );

    return () => unsub();
  }, []);

  const handleEditClick = () => {
    if (data) {
      setEditValue(data.amount.toString());
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue("");
  };

  const handleSaveClick = () => {
    // Basic validation
    if (!editValue || isNaN(Number(editValue))) return;
    setShowConfirm(true);
  };

  const handleConfirmUpdate = async () => {
    setUpdating(true);
    try {
      const docRef = doc(db, FIREBASE_COLLECTIONS.COUNTERS, "developersCut");
      await updateDoc(docRef, {
        amount: Number(editValue),
        updatedOn: Timestamp.now(),
      });
      setIsEditing(false);
      setShowConfirm(false);
      setMessage("Update successful!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating developers cut:", error);
      setMessage("Error: Failed to update.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow animate-pulse h-24"></div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Developers Cut</h2>
        {!isEditing && (
          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaEdit /> Edit
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-500">Current Amount in Ksh</label>
        {isEditing ? (
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-xs"
              placeholder="Enter amount"
            />
            <button
              onClick={handleSaveClick}
              className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
              title="Save"
            >
              <FaCheck />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
              title="Cancel"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <div className="text-3xl font-bold text-gray-800">
            Ksh {data?.amount?.toLocaleString() ?? 0}
          </div>
        )}
        {data?.updatedOn && !isEditing && (
          <div className="text-xs text-gray-400 mt-2">
            Last updated: {data.updatedOn.toDate().toLocaleString()}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex flex-col items-center text-center mb-6">
              <MdWarning className="text-yellow-500 w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Confirm Update
              </h3>
              <p className="text-gray-600">
                Are you sure you want to update the Developers Cut to Ksh{" "}
                <span className="font-bold">{editValue}</span>?
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors font-medium"
                disabled={updating}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                disabled={updating}
              >
                {updating ? "Updating..." : "Confirm Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`mt-4 p-3 rounded text-sm ${
            message.includes("Error")
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
