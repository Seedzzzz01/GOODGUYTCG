"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import BountyRank from "@/components/gamification/BountyRank";
import RankBadge from "@/components/gamification/RankBadge";
import { formatPrice, getRankBySpent } from "@/lib/constants";

interface UserProfile {
  id: string; email: string; displayName: string; phone: string;
  lineId: string; avatarUrl: string; totalSpent: number;
  orderCount: number; role: string; createdAt: string;
}

interface OrderItem { productName: string; productCode: string; quantity: number; price: number; }
interface Order {
  id: string; orderNumber: string; status: string;
  subtotal: number; discountAmount: number; total: number;
  discountRank: string; createdAt: string; items: OrderItem[];
}

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400",
  PAYMENT_UPLOADED: "bg-blue-500/10 text-blue-400",
  PAYMENT_CONFIRMED: "bg-cyan-500/10 text-cyan-400",
  PACKING: "bg-purple-500/10 text-purple-400",
  SHIPPED: "bg-orange-500/10 text-orange-400",
  DELIVERED: "bg-emerald-500/10 text-emerald-400",
  CANCELLED: "bg-red-500/10 text-red-400",
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ displayName: "", phone: "", lineId: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    Promise.all([
      fetch("/api/user/profile").then(r => r.json()),
      fetch("/api/orders").then(r => r.json()),
    ])
      .then(([p, o]) => {
        setProfile(p);
        setOrders(Array.isArray(o) ? o : []);
        setEditForm({ displayName: p.displayName || "", phone: p.phone || "", lineId: p.lineId || "" });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session]);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      const updated = await res.json();
      setProfile(p => p ? { ...p, ...updated } : p);
      setEditing(false);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-amber-100/30 text-sm">Please sign in to view your profile</p>
      </div>
    );
  }

  const rank = getRankBySpent(profile.totalSpent);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile Header */}
          <div className="bg-[#0f1535] border border-amber-500/10 rounded-3xl p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <RankBadge rankName={rank.name} color={rank.color} size={72} animate />

              <div className="text-center sm:text-left flex-1">
                {!editing ? (
                  <>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-black text-amber-100">
                        {profile.displayName || profile.email}
                      </h1>
                      <button onClick={() => setEditing(true)} className="text-amber-400/40 hover:text-amber-400 text-xs">
                        ✏️ Edit
                      </button>
                    </div>
                    <p className="text-amber-100/40 text-sm mt-1">
                      {profile.email}
                    </p>
                    {(profile.phone || profile.lineId) && (
                      <div className="flex gap-4 mt-1 text-xs text-amber-100/30">
                        {profile.phone && <span>📱 {profile.phone}</span>}
                        {profile.lineId && <span>💬 LINE: {profile.lineId}</span>}
                      </div>
                    )}
                    <p className="text-amber-100/20 text-xs mt-1">
                      Member since {new Date(profile.createdAt).toLocaleDateString("th-TH", { month: "long", year: "numeric" })}
                    </p>
                  </>
                ) : (
                  <div className="space-y-2 w-full max-w-sm">
                    <input
                      value={editForm.displayName}
                      onChange={e => setEditForm(f => ({ ...f, displayName: e.target.value }))}
                      placeholder="Display Name"
                      className="w-full bg-[#1a2040] border border-amber-500/10 rounded-lg px-3 py-2 text-sm text-amber-100 focus:outline-none focus:border-amber-500/30"
                    />
                    <div className="flex gap-2">
                      <input
                        value={editForm.phone}
                        onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="Phone"
                        className="flex-1 bg-[#1a2040] border border-amber-500/10 rounded-lg px-3 py-2 text-sm text-amber-100 focus:outline-none focus:border-amber-500/30"
                      />
                      <input
                        value={editForm.lineId}
                        onChange={e => setEditForm(f => ({ ...f, lineId: e.target.value }))}
                        placeholder="LINE ID"
                        className="flex-1 bg-[#1a2040] border border-amber-500/10 rounded-lg px-3 py-2 text-sm text-amber-100 focus:outline-none focus:border-amber-500/30"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleSave} disabled={saving} className="bg-amber-500 text-[#0a0e27] font-bold text-xs px-4 py-1.5 rounded-lg">
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button onClick={() => setEditing(false)} className="text-amber-100/30 text-xs">Cancel</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-6 text-center">
                <div>
                  <p className="text-amber-400 font-black text-2xl">{profile.orderCount}</p>
                  <p className="text-amber-100/30 text-xs">Orders</p>
                </div>
                <div>
                  <p className="text-amber-400 font-black text-2xl">฿{formatPrice(profile.totalSpent)}</p>
                  <p className="text-amber-100/30 text-xs">Total Spent</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bounty Rank */}
            <div className="lg:col-span-1">
              <BountyRank totalSpent={profile.totalSpent} />
            </div>

            {/* Order History */}
            <div className="lg:col-span-2">
              <div className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-6">
                <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-4">
                  Order History
                </h3>

                {orders.length === 0 ? (
                  <p className="text-amber-100/20 text-sm text-center py-8">
                    No orders yet — start shopping! 🏴‍☠️
                  </p>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order, i) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 bg-[#0a0e27]/50 rounded-xl border border-amber-500/5"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div>
                            <p className="text-amber-100 font-bold text-sm">{order.orderNumber}</p>
                            <p className="text-amber-100/30 text-xs">
                              {new Date(order.createdAt).toLocaleDateString("th-TH")}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-amber-400 font-bold text-sm">
                              ฿{formatPrice(order.total)}
                            </span>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_STYLE[order.status] || "bg-gray-500/10 text-gray-400"}`}>
                              {order.status.replace(/_/g, " ")}
                            </span>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="mt-2 space-y-0.5">
                          {order.items?.map((item, j) => (
                            <p key={j} className="text-amber-100/40 text-xs">
                              {item.productCode} {item.productName} × {item.quantity}
                            </p>
                          ))}
                        </div>

                        {order.discountAmount > 0 && (
                          <p className="text-emerald-400/50 text-[10px] mt-1">
                            Rank discount ({order.discountRank}): -฿{formatPrice(order.discountAmount)}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
