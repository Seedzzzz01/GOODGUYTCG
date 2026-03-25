"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice, getRankBySpent, BOUNTY_RANKS } from "@/lib/constants";
import RankBadge from "@/components/gamification/RankBadge";

interface OrderItem { productName: string; productCode: string; quantity: number; price: number; }
interface Order {
  id: string; orderNumber: string; status: string;
  subtotal: number; discountAmount: number; total: number;
  discountRank: string; createdAt: string;
  items: OrderItem[];
}
interface Address {
  id: string; name: string; phone: string; address: string;
  province: string; zipcode: string; isDefault: boolean;
}
interface CustomerDetail {
  id: string; email: string; displayName: string; phone: string;
  lineId: string; avatarUrl: string; totalSpent: number;
  orderCount: number; role: string; createdAt: string;
  orders: Order[]; shippingAddresses: Address[];
}

const TABS = ["Overview", "Orders", "Addresses"] as const;

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-500/10",
  PAYMENT_UPLOADED: "text-blue-400 bg-blue-500/10",
  PAYMENT_CONFIRMED: "text-cyan-400 bg-cyan-500/10",
  PACKING: "text-purple-400 bg-purple-500/10",
  SHIPPED: "text-orange-400 bg-orange-500/10",
  DELIVERED: "text-emerald-400 bg-emerald-500/10",
  CANCELLED: "text-red-400 bg-red-500/10",
};

interface Props {
  customerId: string;
  onClose: () => void;
  onUpdated: () => void;
}

export default function CustomerModal({ customerId, onClose, onUpdated }: Props) {
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<typeof TABS[number]>("Overview");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ displayName: "", phone: "", lineId: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/customers/${customerId}`)
      .then(r => r.json())
      .then(data => {
        setCustomer(data);
        setEditForm({ displayName: data.displayName, phone: data.phone, lineId: data.lineId });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [customerId]);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/admin/customers/${customerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      const updated = await res.json();
      setCustomer(c => c ? { ...c, ...updated } : c);
      setEditing(false);
      onUpdated();
    }
    setSaving(false);
  };

  const rank = customer ? getRankBySpent(customer.totalSpent) : BOUNTY_RANKS[0];
  const nextRank = customer ? BOUNTY_RANKS[BOUNTY_RANKS.findIndex(r => r.name === rank.name) + 1] : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-3xl max-h-[85vh] bg-[#0f1535] border border-amber-500/20 rounded-2xl overflow-hidden flex flex-col"
        >
          {loading || !customer ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Header: Rank badge + name + stats */}
              <div className="px-6 py-5 border-b border-amber-500/10 flex items-center gap-4">
                <RankBadge rankName={rank.name} color={rank.color} size={56} />
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-black text-amber-100 truncate">
                    {customer.displayName || customer.email}
                  </h2>
                  <p className="text-amber-100/30 text-xs">{customer.email}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-bold" style={{ color: rank.color }}>{rank.name}</span>
                    {rank.discount > 0 && (
                      <span className="text-xs text-amber-400/50">-{rank.discount}%</span>
                    )}
                    <span className="text-amber-100/20">•</span>
                    <span className="text-xs text-amber-100/40">Since {new Date(customer.createdAt).toLocaleDateString("th-TH")}</span>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-amber-400 font-black text-xl">฿{formatPrice(customer.totalSpent)}</p>
                  <p className="text-amber-100/30 text-[10px]">{customer.orderCount} orders</p>
                </div>
                <button onClick={onClose} className="text-amber-100/30 hover:text-amber-100/60 text-2xl ml-2">&times;</button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-amber-500/10 px-6">
                {TABS.map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 py-2.5 text-sm font-bold transition-colors relative ${
                      tab === t ? "text-amber-400" : "text-amber-100/30 hover:text-amber-100/50"
                    }`}
                  >
                    {t}
                    {t === "Orders" && <span className="ml-1 text-[10px] opacity-50">({customer.orders.length})</span>}
                    {tab === t && (
                      <motion.div layoutId="ctab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {tab === "Overview" && (
                  <div className="space-y-6">
                    {/* Rank Progress */}
                    <div className="bg-[#1a2040] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-amber-400 text-xs font-bold uppercase tracking-wider">Bounty Rank Progress</h3>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        {BOUNTY_RANKS.map((r, i) => {
                          const achieved = customer.totalSpent >= r.minSpent;
                          return (
                            <div key={r.name} className={`flex flex-col items-center flex-1 ${achieved ? "" : "opacity-30"}`}>
                              <RankBadge rankName={r.name} color={r.color} size={36} />
                              <span className="text-[9px] mt-1 font-bold" style={{ color: r.color }}>{r.name}</span>
                              <span className="text-[8px] text-amber-100/30">฿{formatPrice(r.minSpent)}</span>
                            </div>
                          );
                        })}
                      </div>
                      {nextRank && (
                        <div>
                          <div className="h-1.5 bg-[#0f1535] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${Math.min(((customer.totalSpent - rank.minSpent) / (nextRank.minSpent - rank.minSpent)) * 100, 100)}%`,
                                background: `linear-gradient(90deg, ${rank.color}, ${nextRank.color})`,
                              }}
                            />
                          </div>
                          <p className="text-[10px] text-amber-100/30 mt-1 text-center">
                            ฿{formatPrice(nextRank.minSpent - customer.totalSpent)} more → <span style={{ color: nextRank.color }}>{nextRank.name}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Profile Info */}
                    <div className="bg-[#1a2040] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-amber-400 text-xs font-bold uppercase tracking-wider">Profile</h3>
                        {!editing ? (
                          <button onClick={() => setEditing(true)} className="text-amber-400/50 hover:text-amber-400 text-xs font-bold">Edit</button>
                        ) : (
                          <div className="flex gap-2">
                            <button onClick={() => setEditing(false)} className="text-amber-100/30 text-xs">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="bg-amber-500 text-[#0a0e27] text-xs font-bold px-3 py-1 rounded">
                              {saving ? "..." : "Save"}
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <InfoField label="Name" value={editing ? undefined : (customer.displayName || "—")}>
                          {editing && <input value={editForm.displayName} onChange={e => setEditForm(f => ({ ...f, displayName: e.target.value }))} className={inputCls} />}
                        </InfoField>
                        <InfoField label="Email" value={customer.email} />
                        <InfoField label="Phone" value={editing ? undefined : (customer.phone || "—")}>
                          {editing && <input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} />}
                        </InfoField>
                        <InfoField label="LINE ID" value={editing ? undefined : (customer.lineId || "—")}>
                          {editing && <input value={editForm.lineId} onChange={e => setEditForm(f => ({ ...f, lineId: e.target.value }))} className={inputCls} />}
                        </InfoField>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <StatBox label="Total Spent" value={`฿${formatPrice(customer.totalSpent)}`} color="text-amber-400" />
                      <StatBox label="Orders" value={String(customer.orderCount)} color="text-emerald-400" />
                      <StatBox label="Avg Order" value={customer.orderCount > 0 ? `฿${formatPrice(Math.round(customer.totalSpent / customer.orderCount))}` : "—"} color="text-blue-400" />
                    </div>
                  </div>
                )}

                {tab === "Orders" && (
                  <div className="space-y-2">
                    {customer.orders.length === 0 ? (
                      <p className="text-amber-100/20 text-sm text-center py-10">No orders yet</p>
                    ) : (
                      customer.orders.map(order => (
                        <div key={order.id} className="bg-[#1a2040] rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="text-amber-400 font-bold text-sm">{order.orderNumber}</span>
                              <span className="text-amber-100/20 text-xs ml-2">
                                {new Date(order.createdAt).toLocaleDateString("th-TH")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] || "text-gray-400 bg-gray-500/10"}`}>
                                {order.status.replace(/_/g, " ")}
                              </span>
                              <span className="text-amber-400 font-bold text-sm">฿{formatPrice(order.total)}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center justify-between text-xs">
                                <span className="text-amber-100/60">{item.productCode} {item.productName} × {item.quantity}</span>
                                <span className="text-amber-100/30">฿{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                          {order.discountAmount > 0 && (
                            <p className="text-emerald-400/60 text-[10px] mt-1">
                              Rank discount ({order.discountRank}): -฿{formatPrice(order.discountAmount)}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {tab === "Addresses" && (
                  <div className="space-y-2">
                    {customer.shippingAddresses.length === 0 ? (
                      <p className="text-amber-100/20 text-sm text-center py-10">No saved addresses</p>
                    ) : (
                      customer.shippingAddresses.map(addr => (
                        <div key={addr.id} className="bg-[#1a2040] rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-amber-100 font-bold text-sm">{addr.name}</span>
                            {addr.isDefault && <span className="text-amber-400 text-[9px] bg-amber-500/10 px-1.5 py-0.5 rounded">Default</span>}
                          </div>
                          <p className="text-amber-100/50 text-xs">{addr.phone}</p>
                          <p className="text-amber-100/40 text-xs mt-1">{addr.address}, {addr.province} {addr.zipcode}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const inputCls = "w-full bg-[#0f1535] border border-amber-500/10 rounded-lg px-3 py-1.5 text-sm text-amber-100 focus:outline-none focus:border-amber-500/30";

function InfoField({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div>
      <p className="text-amber-100/30 text-[10px] mb-0.5">{label}</p>
      {children || <p className="text-amber-100 text-sm">{value}</p>}
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#1a2040] rounded-xl p-3 text-center">
      <p className={`font-black text-lg ${color}`}>{value}</p>
      <p className="text-amber-100/20 text-[10px]">{label}</p>
    </div>
  );
}
