"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UsersTable from "@/components/admin/dashboard/UsersTable";
import DashboardAnalytics from "@/components/admin/dashboard/DashboardAnalytics";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminUsersPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mt-16 mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <DashboardAnalytics />
        </div>
      </main>
    </div>
  );
}
