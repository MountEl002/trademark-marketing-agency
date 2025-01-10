"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/common/BackToTop";
import SecondNavBar from "../customer/SecondNavbar";

export function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideComponentsOn = ["/login", "/signup", "/admin", "/forgot-password"];

  const isDraftOrderPage = pathname?.startsWith("/customer/orders/drafts/");
  const shouldHideComponents =
    hideComponentsOn.includes(pathname) || isDraftOrderPage;

  if (shouldHideComponents) {
    return <>{children}</>;
  }

  return (
    <>
      <header>
        <Navbar />
        <SecondNavBar />
      </header>
      <main className="min-h-screen mt-16 bg-white">
        <ScrollToTop />
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
