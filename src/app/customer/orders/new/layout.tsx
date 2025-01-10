"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function NewLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading)
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  if (!user) return null;

  return <>{children}</>;
}
