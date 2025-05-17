"use client";

import Chat from "@/components/common/Chat";
import LoadingScreen from "@/components/common/LoadingScreen";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import HeroSectionImage1 from "@/assests/HeroSectionImage1.png";
import NotificationCarousel from "@/components/common/NotificationCarousel";
import { notifications } from "@/contexts/globalData";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, username, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    // Handle routing based on profile completion status
    if (pathname.startsWith("/customer")) {
      if (username && pathname === "/customer/profile-completion") {
        router.push("/customer/dashboards");
      } else if (!username && pathname !== "/customer/profile-completion") {
        router.push("/customer/profile-completion");
      }
    }
  }, [user, username, loading, router, pathname]);

  // Show loading screen while authentication is in progress
  if (loading) return <LoadingScreen />;

  // Redirect if not authenticated
  if (!user) return null;

  // Show loading during redirects
  if (
    (user &&
      !username &&
      pathname.startsWith("/customer") &&
      pathname !== "/customer/profile-completion") ||
    (user && username && pathname === "/customer/profile-completion")
  ) {
    return <LoadingScreen />;
  }

  if (
    pathname === "/customer/profile-completion" ||
    pathname === "/customer/deposit"
  ) {
    return (
      <>
        <Navbar />
        <Chat />
        {children}
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Chat />
      <div
        className="relative min-h-screen"
        style={{
          backgroundImage: `url(${HeroSectionImage1.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >
        <section className="min-h-[40vh]">
          <NotificationCarousel notifications={notifications} />
        </section>
        {children}
      </div>
    </>
  );
}
