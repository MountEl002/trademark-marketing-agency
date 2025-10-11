// app/admin/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/common/LoadingScreen";
import AdminChatWindow from "@/components/common/AdminChatWindow";
import Navbar from "@/components/admin/layout/Navbar";
import Chat from "@/components/common/Chat";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      if (pathname !== "/admin/login") {
        router.push("/admin/login");
      }
      return;
    }
    if (user && !isAdmin) {
      router.push("/");
      return;
    }
    if (user && isAdmin && pathname === "/admin/login") {
      router.push("/admin");
    }
  }, [user, isAdmin, loading, router, pathname]);

  if (loading) {
    return <LoadingScreen message="Loading admin dashboard" />;
  }

  if (!user && pathname === "/admin/login") {
    return (
      <>
        <Chat />
        {children}
      </>
    );
  }
  if (user && isAdmin && pathname !== "/admin/login") {
    return (
      <>
        <Navbar />
        {children}
        <AdminChatWindow />
      </>
    );
  }
  if (user && isAdmin && pathname === "/admin/login") {
    return <LoadingScreen message="Redirecting to admin dashboard..." />;
  }
  return null;
}
