"use client";

import { IconType } from "react-icons";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { FIREBASE_COLLECTIONS } from "@/lib/constants";
import {
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
  FiPackage,
  FiAward,
  FiCreditCard,
  FiCode,
} from "react-icons/fi";
import { FaMoneyBillWave } from "react-icons/fa";

interface UserAnalytics {
  totalUsers: number;
  usersWithBasicPackage: number;
  usersWithEarlyPayment: number;
  usersWithGoldPackage: number;
  usersWithPremiumCode: number;
  usersWithSilverPackage: number;
}

interface DevelopersCut {
  amount: number;
  updatedOn?: Timestamp;
}

export default function DashboardAnalytics() {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [developersCut, setDevelopersCut] = useState<DevelopersCut | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyticsRef = doc(
      db,
      FIREBASE_COLLECTIONS.COUNTERS,
      "userAnalytics",
    );
    const developersCutRef = doc(
      db,
      FIREBASE_COLLECTIONS.COUNTERS,
      "developersCut",
    );

    const unsubAnalytics = onSnapshot(
      analyticsRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setAnalytics(docSnap.data() as UserAnalytics);
        } else {
          setAnalytics(null);
        }
      },
      (error) => {
        console.error("Error fetching user analytics:", error);
      },
    );

    const unsubDevelopersCut = onSnapshot(
      developersCutRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setDevelopersCut(docSnap.data() as DevelopersCut);
        } else {
          setDevelopersCut({ amount: 0 });
        }
      },
      (error) => {
        console.error("Error fetching developers cut:", error);
      },
    );

    // Initial loading state handling - we'll just wait a bit or let the data flow in
    // Since onSnapshot is async but fires immediately (ish), we can set loading to false after setup
    // But better to wait for data if we want a skeleton.
    // For simplicity with real-time listeners, we can just set loading false after a small timeout or when data arrives.
    // Let's set loading to false when both have emitted at least once or immediately.
    setLoading(false);

    return () => {
      unsubAnalytics();
      unsubDevelopersCut();
    };
  }, []);

  if (loading) {
    return (
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    colorClass,
  }: {
    title: string;
    value: number;
    icon: IconType;
    colorClass: string;
  }) => (
    <div className="bg-gray-50 rounded-lg shadow p-6 flex items-start justify-between hover:scale-110 transition-all duration-500 cursor-pointer">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">
          {value.toLocaleString()}
        </h3>
      </div>
      <div className={`p-3 rounded-full ${colorClass} text-white`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="mt-8 space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          User Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={analytics?.totalUsers || 0}
            icon={FiUsers}
            colorClass="bg-blue-500"
          />
          <StatCard
            title="Early Payment Users"
            value={analytics?.usersWithEarlyPayment || 0}
            icon={FiCreditCard}
            colorClass="bg-purple-500"
          />
          <StatCard
            title="Basic Package Users"
            value={analytics?.usersWithBasicPackage || 0}
            icon={FiPackage}
            colorClass="bg-indigo-500"
          />
          <StatCard
            title="Silver Package Users"
            value={analytics?.usersWithSilverPackage || 0}
            icon={FiAward}
            colorClass="bg-gray-500"
          />
          <StatCard
            title="Gold Package Users"
            value={analytics?.usersWithGoldPackage || 0}
            icon={FiAward}
            colorClass="bg-yellow-500"
          />
          <StatCard
            title="Premium Code Users"
            value={analytics?.usersWithPremiumCode || 0}
            icon={FiCode}
            colorClass="bg-pink-500"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Financial Overview
        </h2>
        <div className="bg-gray-50 rounded-lg shadow p-6 max-w-sm hover:scale-110 transition-all duration-500 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Developers Cut
              </p>
              <h3 className="text-3xl font-bold text-gray-800">
                Ksh {developersCut?.amount?.toLocaleString() ?? 0}
              </h3>
              {developersCut?.updatedOn && (
                <p className="text-xs text-gray-400 mt-2">
                  Last updated:{" "}
                  {developersCut.updatedOn.toDate().toLocaleString()}
                </p>
              )}
            </div>
            <div className="p-4 rounded-full bg-emerald-500 text-white">
              <FaMoneyBillWave size={32} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
