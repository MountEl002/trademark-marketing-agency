"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";

export default function CustomerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        router.push("/customer/dashboards");
      }
    }
  }, [loading, router, user]);

  if (loading) return <LoadingScreen />;

  return null;
}
