"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/products", label: "Products", icon: "🃏" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0a0e1a] border-r border-amber-500/10 flex-shrink-0">
        <div className="p-4 border-b border-amber-500/10">
          <h2 className="text-amber-400 font-black text-sm tracking-wider">
            ADMIN PANEL
          </h2>
        </div>
        <nav className="p-2 space-y-1">
          {adminNav.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "text-amber-100/40 hover:text-amber-100/60 hover:bg-amber-500/5"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 mt-auto">
          <Link
            href="/"
            className="text-xs text-amber-100/20 hover:text-amber-100/40 transition-colors"
          >
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
