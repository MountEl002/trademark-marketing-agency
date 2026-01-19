import type { Metadata } from "next";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Roboto, Lato } from "next/font/google";
import { ClientLayoutWrapper } from "@/components/layout/ClientLayoutWrapper";
import { Providers } from "./providers";
import OfflineOverlay from "@/components/layout/OfflineOverlay";
import { adminDb } from "@/lib/firebase-admin";
import { FIREBASE_COLLECTIONS } from "@/lib/constants";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trademark Marketing Agency",
  description: "Offering marketing services for your business",

  // Add additional metadata for SEO
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Trademark Marketing Agency",
    description: "Offering marketing services for your business",
    type: "website",
  },
};

export const revalidate = 0; // Disable static optimization for this layout to ensure fresh data

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("RootLayout: Rendering RootLayout component");

  let isOffline = false;
  let isSuperAdminPage = false;

  try {
    const offlineStatusDoc = await adminDb
      .collection(FIREBASE_COLLECTIONS.SUPER_ADMIN_OPERATIONS)
      .doc("offlineStatus")
      .get();

    if (offlineStatusDoc.exists) {
      isOffline = offlineStatusDoc.data()?.isOffline || false;
    }

    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";
    console.log("RootLayout: Current page:", pathname);

    if (pathname.startsWith("/admin/super-admin")) {
      isSuperAdminPage = true;
    }
  } catch (error) {
    console.error("RootLayout: Error fetching offline status:", error);
    // Default to false (online) in case of error, or could fail safe to offline if preferred
  }

  if (isOffline && !isSuperAdminPage) {
    console.log("RootLayout: Rendering in offline mode");
    return (
      <html lang="en" className={`${roboto.variable} ${lato.variable}`}>
        <body
          className={`font-sans ${
            process.env.NODE_ENV === "development" ? "debug-screens" : ""
          }`}
        >
          <OfflineOverlay />
        </body>
      </html>
    );
  } else {
    console.log("RootLayout: Rendering in online mode");
    return (
      <html lang="en" className={`${roboto.variable} ${lato.variable}`}>
        <body
          className={`font-sans ${
            process.env.NODE_ENV === "development" ? "debug-screens" : ""
          }`}
        >
          <Providers>
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
            <Analytics />
          </Providers>
        </body>
      </html>
    );
  }
}
