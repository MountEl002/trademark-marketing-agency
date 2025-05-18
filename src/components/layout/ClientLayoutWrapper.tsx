"use client";

import { usePathname } from "next/navigation";
// import Navbar from "@/components/layout/Navbar";
import ScrollToTop from "@/components/common/BackToTop";
import Chat from "../common/Chat";

export function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideComponentsOn = ["/login", "/signup", "/forgot-password"];

  const isCustomerPage = pathname?.startsWith("/customer");
  const isAdminPage = pathname?.startsWith("/admin");
  const shouldHideComponents =
    hideComponentsOn.includes(pathname) || isAdminPage || isCustomerPage;

  if (shouldHideComponents) {
    return <>{children}</>;
  }

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
