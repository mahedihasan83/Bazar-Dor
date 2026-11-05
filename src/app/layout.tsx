import "./globals.css";
import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind",
});

export const metadata: Metadata = {
  title: "বাজার দর | BazarDor",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে।",
  icons: { icon: "/logo-icon.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" data-theme="bazar" className={hind.variable}>
      <body className="min-h-screen flex flex-col bg-base-200 text-base-content">
        <Providers />
        <Navbar />
        <Ticker />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
