import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GOODGUY TCG | One Piece Card Game Store",
  description:
    "การ์ด One Piece TCG ของแท้ ขายแยก Box ส่งทั่วไทย สมัคร Bounty Rank รับส่วนลดทุกออเดอร์",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://goodguytcg.com"),
  openGraph: {
    title: "GOODGUY TCG | One Piece Card Game Store",
    description: "การ์ด One Piece ของแท้ JP Version ส่งตรงถึงบ้าน พร้อมระบบ Bounty Rank รับส่วนลดสะสม",
    siteName: "GOODGUY TCG",
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GOODGUY TCG",
    description: "การ์ด One Piece TCG ของแท้ ส่งทั่วไทย",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0e27] text-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
