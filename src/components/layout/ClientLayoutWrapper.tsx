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
  const isAdminPage = pathname?.startsWith("/admin");
  const shouldHideComponents = hideComponentsOn.includes(pathname);

  if (isAdminPage) {
    return (
      <>
        <ScrollToTop />
        {children}
      </>
    );
  }

  if (shouldHideComponents) {
    return (
      <>
        <Chat />
        <ScrollToTop />
        {children}
      </>
    );
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
