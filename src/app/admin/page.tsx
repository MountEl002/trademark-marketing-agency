"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UsersTable from "@/components/admin/dashboard/UsersTable";
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
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <UsersTable />
        </div>
      </main>
    </div>
  );
}
