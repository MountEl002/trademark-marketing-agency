"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { isUserSuperAdmin } from "@/utils/admin-setup";
import AdminChatWindow from "@/components/admin/chats/AdminChatWindow";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Skip auth check for login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const adminStatus = await isUserSuperAdmin(user.uid);
        setIsAuthorized(adminStatus);
        if (!adminStatus) {
          router.push("/admin/login");
        }
      } else {
        setIsAuthorized(false);
        router.push("/admin/login");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router, isLoginPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  // Allow rendering of login page without authorization
  if (!isAuthorized && !isLoginPage) {
    return null;
  }

  // For login page, render without the admin layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Regular admin layout for authorized users
  return (
    <div className="relative flex h-screen">
      <aside className="w-64 bg-gray-800 text-white p-6">
        <nav className="space-y-4">
          <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-100 overflow-auto">{children}</main>
      <AdminChatWindow />
    </div>
  );
}
