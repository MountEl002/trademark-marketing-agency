"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/components/common/LoadingAnimantion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Only run redirects after auth state is fully determined
    if (!loading) {
      if (!user) {
        // User is not authenticated - redirect to admin login
        router.push("/admin/login");
      } else if (!isAdmin) {
        // User is authenticated but not an admin - redirect to home
        router.push("/");
      } else {
        // User is authenticated and is an admin
        setAuthChecked(true);
      }
    }
  }, [user, isAdmin, loading, router]);

  // Show loading state while checking authentication
  if (loading || (!authChecked && user && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-4 bg-gray-900 text-white">
        <LoadingAnimation className="mr-3" />
        <p>Loading...</p>
      </div>
    );
  }

  // Only render children when user is authenticated and is confirmed as admin
  return authChecked ? children : null;
}
