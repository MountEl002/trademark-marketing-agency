import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Footer from "@/components/layout/footer";
import ScrollToTop from "@/components/common/backToTop";
import { Roboto, Lato } from "next/font/google";
import SecondNavbar from "@/components/layout/secondNavbar";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["400", "700", "900"], // Adding different weights for headings
  display: "swap",
});

export const metadata: Metadata = {
  title: "Affordable High-Quality Essays",
  description: "Offering Affordable High Quality Essay Services",
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
          process.env.NODE_ENV == "development" ? "debug-screens" : ""
        }`}
      >
        <header>
          <SecondNavbar />
        </header>
        <main className="min-h-screen mt-16 bg-white">
          <ScrollToTop />
          {children}
        </main>
        <footer>
          <Footer />
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
