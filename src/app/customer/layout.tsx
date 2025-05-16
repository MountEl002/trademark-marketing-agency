"use client";

import Chat from "@/components/common/Chat";
import LoadingScreen from "@/components/common/LoadingScreen";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import HeroSectionImage1 from "@/assests/HeroSectionImage1.png"; // Adjust the path as necessary
import NotificationCarousel from "@/components/common/NotificationCarousel";
import { notifications } from "@/contexts/globalData"; // Adjust the path as necessary

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, username, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    if (pathname.startsWith("/customer")) {
      if (username) {
        if (pathname === "/customer/profile-completion") {
          router.push("/customer/dashboards");
        }
      } else {
        if (pathname !== "/customer/profile-completion") {
          router.push("/customer/profile-completion");
        }
      }
    }
  }, [user, username, loading, router, pathname]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null;
  }

  if (
    user &&
    !username &&
    pathname.startsWith("/customer") &&
    pathname !== "/customer/profile-completion"
  ) {
    return <LoadingScreen />;
  }

  if (user && username && pathname === "/customer/profile-completion") {
    return <LoadingScreen />;
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
