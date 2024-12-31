"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ScrollToTop from "@/components/common/backToTop";

export function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideComponentsOn = ["/login", "/signup", "/admin"];
  const shouldHideComponents = hideComponentsOn.includes(pathname);

  if (shouldHideComponents) {
    return <>{children}</>;
  }

  return (
    <>
      <header>
        <Navbar />
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
