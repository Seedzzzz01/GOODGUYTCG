"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  cartCount: number;
}

export default function Navbar({ cartCount }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/cards", label: "Cards" },
    { href: "/tools", label: "Tools" },
    { href: "/blog", label: "Blog" },
    { href: "/cart", label: "Cart" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
    ...(session
      ? [{ href: "/profile", label: "Crew" }]
      : [{ href: "/auth/login", label: "Login" }]),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Background with wood texture feel */}
      <div className="absolute inset-0 bg-[#0a0805]/95 backdrop-blur-md" />
      {/* Golden trim line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      {/* Subtle rope pattern at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-900/0 via-amber-700/30 to-amber-900/0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Logo */}
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image src="/images/logo.png" alt="Lucky TCG" width={40} height={40} className="object-contain" />
            </div>

            <div className="flex flex-col">
              <span className="text-amber-400 font-black text-base tracking-[0.15em] leading-none"
                style={{ textShadow: "0 0 12px rgba(255,215,0,0.2)" }}>
                LUCKY TCG THAILAND
              </span>
              <span className="text-amber-600/60 text-[9px] tracking-[0.4em] leading-none mt-0.5 font-medium">
                TCG STORE
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-amber-200/50 hover:text-amber-400 transition-colors duration-200 group"
              >
                <span className="text-xs font-bold tracking-wider uppercase">{link.label}</span>
                {link.href === "/cart" && cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
                {/* Underline effect */}
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent group-hover:w-4/5 transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-amber-500 p-2"
            aria-label="Toggle menu"
          >
            <motion.div
              animate={isOpen ? "open" : "closed"}
              className="w-5 h-4 flex flex-col justify-between"
            >
              <motion.span
                variants={{
                  open: { rotate: 45, y: 7 },
                  closed: { rotate: 0, y: 0 },
                }}
                className="w-full h-0.5 bg-amber-500 block origin-left"
              />
              <motion.span
                variants={{
                  open: { opacity: 0 },
                  closed: { opacity: 1 },
                }}
                className="w-full h-0.5 bg-amber-500 block"
              />
              <motion.span
                variants={{
                  open: { rotate: -45, y: -7 },
                  closed: { rotate: 0, y: 0 },
                }}
                className="w-full h-0.5 bg-amber-500 block origin-left"
              />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-[#0a0805]/98 backdrop-blur-md" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

            <div className="relative px-4 py-3 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-amber-200/60 hover:text-amber-400 hover:bg-amber-500/5 rounded-lg transition-colors"
                >
                  <span className="text-sm font-bold tracking-wider uppercase">{link.label}</span>
                  {link.href === "/cart" && cartCount > 0 && (
                    <span className="w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
