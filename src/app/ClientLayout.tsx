"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/hooks/useCart";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { totalItems } = useCart();

  return (
    <SessionProvider>
      <Navbar cartCount={totalItems} />
      <main className="flex-1 relative z-10 pt-14">{children}</main>
      <Footer />
    </SessionProvider>
  );
}
