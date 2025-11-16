"use client";

import { usePathname } from "next/navigation";
// import Navbar from "@/components/layout/Navbar";
import ScrollToTop from "@/components/common/BackToTop";
import Chat from "../common/Chat";
import OfflineOverlay from "./OfflineOverlay";

export function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideComponentsOn = ["/login", "/signup", "/forgot-password"];
  const isAdminPage = pathname?.startsWith("/admin");
  const shouldHideComponents = hideComponentsOn.includes(pathname);
  const isOffline = true;

  if (isAdminPage && !isOffline) {
    return (
      <>
        <ScrollToTop />
        {children}
      </>
    );
  }

  if (shouldHideComponents && !isOffline) {
    return (
      <>
        <Chat />
        <ScrollToTop />
        {children}
      </>
    );
  }

  if (!isOffline) {
    return (
      <>
        <main className="min-h-screen mt-16 bg-white">
          <Chat />
          <ScrollToTop />
          {children}
        </main>
      </>
    );
  }
  return <OfflineOverlay />;
}
