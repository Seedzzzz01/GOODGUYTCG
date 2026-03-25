"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import TreasureToast from "@/components/ui/TreasureToast";
import { useCart } from "@/hooks/useCart";
import { ToastContext, useToastState } from "@/hooks/useToast";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { totalItems } = useCart();
  const toastState = useToastState();

  return (
    <SessionProvider>
      <ToastContext.Provider value={toastState}>
        <Navbar cartCount={totalItems} />
        <main className="flex-1 relative z-10 pt-14">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <TreasureToast toasts={toastState.toasts} removeToast={toastState.removeToast} />
      </ToastContext.Provider>
    </SessionProvider>
  );
}
