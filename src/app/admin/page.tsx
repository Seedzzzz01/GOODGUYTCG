"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/constants";

interface Stats {
  totalOrders: number;
  ordersToday: number;
  pendingPayments: number;
  totalRevenue: number;
  totalCustomers: number;
  lowStockProducts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  const cards = stats
    ? [
        { label: "Total Orders", value: stats.totalOrders, icon: "📦", color: "text-blue-400" },
        { label: "Orders Today", value: stats.ordersToday, icon: "📋", color: "text-green-400" },
        { label: "Pending Payments", value: stats.pendingPayments, icon: "⏳", color: "text-yellow-400" },
        { label: "Total Revenue", value: `฿${formatPrice(stats.totalRevenue)}`, icon: "💰", color: "text-amber-400" },
        { label: "Customers", value: stats.totalCustomers, icon: "👥", color: "text-purple-400" },
        { label: "Low Stock", value: stats.lowStockProducts, icon: "⚠️", color: "text-red-400" },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-black text-amber-400 mb-6">Dashboard</h1>

      {!stats ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#0f1535] border border-amber-500/10 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{card.icon}</span>
              </div>
              <p className={`text-2xl font-black ${card.color}`}>{card.value}</p>
              <p className="text-amber-100/30 text-xs mt-1">{card.label}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
