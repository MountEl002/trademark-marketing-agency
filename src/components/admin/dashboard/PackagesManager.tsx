"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  increment,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiTrash2 } from "react-icons/fi";

interface Package {
  id: string;
  packageId: string;
  packageName: string;
  packagePrice: number;
  purchasedAt: Timestamp;
  status: string;
  features?: string[];
}

interface PackagesManagerProps {
  userId: string;
}

export default function PackagesManager({ userId }: PackagesManagerProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    packageId: string;
    packageName: string;
    packagePrice: number;
  }>({
    isOpen: false,
    packageId: "",
    packageName: "",
    packagePrice: 0,
  });
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isSuccess: boolean;
  }>({
    isOpen: false,
    title: "",
    message: "",
    isSuccess: false,
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const packagesRef = collection(db, "users", userId, "packages");
        const snapshot = await getDocs(packagesRef);
        const packagesData: Package[] = [];

        snapshot.forEach((doc) => {
          packagesData.push({
            id: doc.id,
            ...doc.data(),
          } as Package);
        });

        setPackages(packagesData);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setAlertDialog({
          isOpen: true,
          title: "Error",
          message: "Failed to fetch packages",
          isSuccess: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [userId]);

  const handleDeleteClick = (pkg: Package) => {
    setConfirmDialog({
      isOpen: true,
      packageId: pkg.id,
      packageName: pkg.packageName,
      packagePrice: pkg.packagePrice,
    });
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      // Delete package document
      await deleteDoc(
        doc(db, "users", userId, "packages", confirmDialog.packageId)
      );

      // Update user balance
      await updateDoc(doc(db, "users", userId), {
        balance: increment(confirmDialog.packagePrice),
      });

      // Update local state
      setPackages(packages.filter((pkg) => pkg.id !== confirmDialog.packageId));

      setAlertDialog({
        isOpen: true,
        title: "Success",
        message: `Package "${
          confirmDialog.packageName
        }" deleted successfully. User balance increased by Ksh ${confirmDialog.packagePrice.toLocaleString()}.`,
        isSuccess: true,
      });
    } catch (error) {
      console.error("Error deleting package:", error);
      setAlertDialog({
        isOpen: true,
        title: "Error",
        message: "Failed to delete package",
        isSuccess: false,
      });
    } finally {
      setDeleting(false);
      setConfirmDialog({
        isOpen: false,
        packageId: "",
        packageName: "",
        packagePrice: 0,
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">User Packages</h3>
        <div className="text-center py-4">Loading packages...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Packages</h3>

        {packages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No packages found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-medium">{pkg.packageName}</h4>
                  <p className="text-sm text-gray-600">
                    Price: {pkg.packagePrice}
                  </p>
                  <p className="text-sm text-gray-600">Status: {pkg.status}</p>
                  {pkg.purchasedAt && (
                    <p className="text-sm text-gray-600">
                      Purchased:{" "}
                      {pkg.purchasedAt.toDate?.().toLocaleDateString() || "N/A"}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteClick(pkg)}
                  className="flex items-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  <FiTrash2 className="mr-1" size={16} />
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the package
              <span className="font-semibold">
                {" "}
                {confirmDialog.packageName}
              </span>
              ? The user’s balance will be increased by{" "}
              <span className="font-semibold">
                Kshs {confirmDialog.packagePrice.toLocaleString()}
              </span>
              .
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() =>
                  setConfirmDialog({
                    isOpen: false,
                    packageId: "",
                    packageName: "",
                    packagePrice: 0,
                  })
                }
                disabled={deleting}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Dialog */}
      {alertDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3
              className={`text-lg font-bold mb-2 ${
                alertDialog.isSuccess ? "text-green-600" : "text-red-600"
              }`}
            >
              {alertDialog.title}
            </h3>
            <p className="text-gray-600 mb-6">{alertDialog.message}</p>
            <div className="flex justify-end">
              <button
                onClick={() =>
                  setAlertDialog({
                    isOpen: false,
                    title: "",
                    message: "",
                    isSuccess: false,
                  })
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
