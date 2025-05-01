"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/common/BackToTop";
import Chat from "../common/Chat";

export function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideComponentsOn = ["/login", "/signup", "/forgot-password"];

  const isDraftOrderPage = pathname?.startsWith("/customer/orders/drafts/");
  const isAdminPage = pathname?.startsWith("/admin");
  const shouldHideComponents =
    hideComponentsOn.includes(pathname) || isDraftOrderPage || isAdminPage;

  if (shouldHideComponents) {
    return <>{children}</>;
  }

  return (
    <>
      <header>
        <Navbar />
        {/* <MainNavbar /> */}
      </header>
      <main className="min-h-screen mt-16 bg-white">
        <Chat />
        <ScrollToTop />
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
