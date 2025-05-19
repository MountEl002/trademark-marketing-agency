"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/components/common/LoadingAnimantion";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/admin/login");
      } else if (!isAdmin) {
        router.push("/");
      } else {
        setAuthChecked(true);
      }
    }
  }, [user, isAdmin, loading, router]);

  if (loading || (!authChecked && user && !isAdmin)) {
    return <LoadingScreen />;
  }

  // Only render children when user is authenticated and is confirmed as admin
  return authChecked ? children : null;
}
