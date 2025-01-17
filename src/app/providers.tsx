"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith("/admin");

  if (isAdminPath) {
    return <>{children}</>;
  }

  return <AuthProvider>{children}</AuthProvider>;
}
