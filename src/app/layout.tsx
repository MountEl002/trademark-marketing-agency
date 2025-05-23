import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Roboto, Lato } from "next/font/google";
import { ClientLayoutWrapper } from "@/components/layout/ClientLayoutWrapper";
import { Providers } from "./providers";

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
        <Providers>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
