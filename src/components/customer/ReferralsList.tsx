"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaUser, FaCalendarAlt, FaBox, FaMoneyBillWave } from "react-icons/fa";
import LoadingScreen from "../common/LoadingScreen";

interface ReferredUser {
  username: string;
  registrationDate: Timestamp | null;
  packages: string[];
  referralBonus: number;
}

const ReferralsList: React.FC = () => {
  const { username } = useAuth();
  const [loading, setLoading] = useState(true);
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [totalBonus, setTotalBonus] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Calculate referral bonus based on package type
  const calculateReferralBonus = (packages: string[]): number => {
    const bonusRates: Record<string, number> = {
      Basic: 150,
      Bronze: 350,
      Silver: 650,
      Gold: 950,
    };

    // Count occurrences of each package
    const packageCounts: Record<string, number> = {};
    packages.forEach((pkg) => {
      packageCounts[pkg] = (packageCounts[pkg] || 0) + 1;
    });

    // Calculate total bonus
    let totalBonus = 0;
    Object.entries(packageCounts).forEach(([packageName, count]) => {
      const rate = bonusRates[packageName] || 0;
      totalBonus += rate * count;
    });

    return totalBonus;
  };

  // Format package names to a grammatically correct string with counts
  const formatPackagesToString = (packages: string[]): string => {
    if (!packages || packages.length === 0) {
      return "None";
    }

    // Count occurrences of each package
    const packageCounts: Record<string, number> = {};
    packages.forEach((pkg) => {
      const normalizedPkg = pkg?.trim() || "";
      if (normalizedPkg) {
        packageCounts[normalizedPkg] = (packageCounts[normalizedPkg] || 0) + 1;
      }
    });

    // Format each package with its count
    const formattedItems = Object.entries(packageCounts).map(
      ([name, count]) => {
        return count > 1 ? `${name} (${count})` : name;
      }
    );

    // Create grammatically correct string with proper Oxford comma and "and"
    if (formattedItems.length === 1) {
      return formattedItems[0];
    } else if (formattedItems.length === 2) {
      return `${formattedItems[0]} and ${formattedItems[1]}`;
    } else {
      const lastItem = formattedItems.pop();
      return `${formattedItems.join(", ")}, and ${lastItem}`;
    }
  };

  // Format date for display
  const formatDate = (timestamp: Timestamp | null): string => {
    if (!timestamp) return "N/A";

    const date = timestamp.toDate();
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchReferredUsers = async () => {
      if (!username) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const referredCollectionPath = `referrals/${username}/referred`;
        const referredCollectionRef = collection(db, referredCollectionPath);
        const referredQuerySnapshot = await getDocs(referredCollectionRef);
        const users: ReferredUser[] = [];
        let totalReferralBonus = 0;

        // Process each referred user from the original query if we got here
        for (const referredDoc of referredQuerySnapshot.docs) {
          const referredData = referredDoc.data();
          const referredUsername = referredDoc.id;

          // Get this referred user's own referral document to access their packages
          const userReferralDocRef = doc(db, "referrals", referredUsername);
          const userReferralDocSnap = await getDoc(userReferralDocRef);

          let packages: string[] = [];
          if (userReferralDocSnap.exists()) {
            const userData = userReferralDocSnap.data();
            packages = Array.isArray(userData.packages)
              ? userData.packages
              : [];
          }

          const referralBonus = calculateReferralBonus(packages);
          totalReferralBonus += referralBonus;

          users.push({
            username: referredUsername,
            registrationDate: referredData.createdAt || null,
            packages: packages,
            referralBonus: referralBonus,
          });
        }

        setReferredUsers(users);
        setTotalBonus(totalReferralBonus);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching referred users:", error);
        setError("Failed to load referrals. Please try again later.");
        setLoading(false);
      }
    };

    fetchReferredUsers();
  }, [username]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        {error}
      </div>
    );
  }

  if (!username) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
        Please complete your profile to view your referrals.
      </div>
    );
  }

  if (referredUsers.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">My Referrals</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">You haven’t referred any users yet.</p>
          <p className="mt-2 text-sm text-gray-500">
            Share your username with others to earn referral bonuses!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">My Referrals</h2>
        <p className="text-sm text-gray-600 mt-1">
          You have referred {referredUsers.length} user
          {referredUsers.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="overflow-x-auto text-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
              >
                <div className="flex items-center space-x-2">
                  <FaUser className="text-gray-400" />
                  <span>Username</span>
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
              >
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>Registration Date</span>
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
              >
                <div className="flex items-center space-x-2">
                  <FaBox className="text-gray-400" />
                  <span>Packages</span>
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
              >
                <div className="flex items-center space-x-2">
                  <FaMoneyBillWave className="text-gray-400" />
                  <span>Referral Bonus</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {referredUsers.map((referredUser, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {referredUser.username}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(referredUser.registrationDate)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {formatPackagesToString(referredUser.packages)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-emerald-600">
                    Ksh {referredUser.referralBonus.toFixed(2)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td
                colSpan={3}
                className="px-6 py-4 text-right text-sm font-medium text-gray-900"
              >
                Total Referral Bonus:
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-base font-bold text-emerald-600">
                  Ksh {totalBonus.toFixed(2)}
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ReferralsList;
