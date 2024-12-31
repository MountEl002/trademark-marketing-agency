import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Roboto, Lato } from "next/font/google";
import { ClientLayoutWrapper } from "@/components/layout/client-layout-wrapper";

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
  title: "Affordable High-Quality Essays",
  description: "Offering Affordable High Quality Essay Services",

  // Add additional metadata for SEO
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Affordable High-Quality Essays",
    description: "Offering Affordable High Quality Essay Services",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${lato.variable}`}>
      <body
        className={`font-sans ${
          process.env.NODE_ENV === "development" ? "debug-screens" : ""
        }`}
      >
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        <Analytics />
      </body>
    </html>
  );
}
