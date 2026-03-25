"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/constants";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-gray-500",
  PAYMENT_UPLOADED: "bg-yellow-500",
  PAYMENT_CONFIRMED: "bg-blue-500",
  PACKING: "bg-purple-500",
  SHIPPED: "bg-cyan-500",
  DELIVERED: "bg-green-500",
  CANCELLED: "bg-red-500",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PAYMENT_UPLOADED: "Slip Uploaded",
  PAYMENT_CONFIRMED: "Confirmed",
  PACKING: "Packing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  shippingName: string;
  createdAt: string;
  user: { email: string; displayName: string };
  items: { productName: string; quantity: number }[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (search) params.set("search", search);

    fetch(`/api/admin/orders?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [statusFilter, search]);

  return (
    <div>
      <h1 className="text-2xl font-black text-amber-400 mb-6">Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search order #, name, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#1a2040] border border-amber-500/10 rounded-lg px-4 py-2 text-sm text-amber-100 placeholder-amber-100/20 w-64 focus:outline-none focus:border-amber-500/30"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1a2040] border border-amber-500/10 rounded-lg px-4 py-2 text-sm text-amber-100"
        >
          <option value="">All Status</option>
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-amber-100/30 text-center py-20">No orders found</p>
      ) : (
        <div className="space-y-2">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
            >
              <Link
                href={`/admin/orders/${order.id}`}
                className="flex items-center gap-4 bg-[#0f1535] border border-amber-500/5 hover:border-amber-500/20 rounded-xl p-4 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-400 font-bold text-sm">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`${STATUS_COLORS[order.status] || "bg-gray-500"} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>
                  <p className="text-amber-100/50 text-xs truncate">
                    {order.user?.displayName || order.shippingName} — {order.user?.email}
                  </p>
                  <p className="text-amber-100/30 text-[10px] mt-0.5">
                    {order.items?.map((item) => `${item.productName} x${item.quantity}`).join(", ")}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-amber-400 font-bold text-sm">
                    ฿{formatPrice(order.total)}
                  </p>
                  <p className="text-amber-100/20 text-[10px]">
                    {new Date(order.createdAt).toLocaleDateString("th-TH")}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
