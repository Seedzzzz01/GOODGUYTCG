"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice, getRankBySpent, BOUNTY_RANKS } from "@/lib/constants";
import RankBadge from "@/components/gamification/RankBadge";
import CustomerModal from "@/components/admin/CustomerModal";

interface Customer {
  id: string;
  email: string;
  displayName: string;
  phone: string;
  totalSpent: number;
  orderCount: number;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const limit = 25;

  const fetchCustomers = (p = page, s = search) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: String(limit) });
    if (s) params.set("search", s);
    fetch(`/api/admin/customers?${params}`)
      .then(r => r.json())
      .then(data => {
        setCustomers(data.customers);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchCustomers(); }, [page]);

  const handleSearch = () => { setPage(1); fetchCustomers(1, search); };

  const stats = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const newThisMonth = customers.filter(c => new Date(c.createdAt) >= thirtyDaysAgo).length;
    const rankCounts = Object.fromEntries(BOUNTY_RANKS.map(r => [r.name, 0]));
    let totalRevenue = 0;
    customers.forEach(c => {
      totalRevenue += c.totalSpent;
      const rank = getRankBySpent(c.totalSpent);
      rankCounts[rank.name]++;
    });
    return { totalRevenue, newThisMonth, rankCounts };
  }, [customers]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-amber-400">Members</h1>
        <p className="text-amber-100/30 text-xs mt-0.5">{total} total members</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-[#0f1535] border border-amber-500/5 rounded-xl px-4 py-3">
          <p className="text-amber-400 font-black text-xl">฿{formatPrice(stats.totalRevenue)}</p>
          <p className="text-amber-100/20 text-[10px]">Total Revenue</p>
        </div>
        <div className="bg-[#0f1535] border border-amber-500/5 rounded-xl px-4 py-3">
          <p className="text-emerald-400 font-black text-xl">{total}</p>
          <p className="text-amber-100/20 text-[10px]">Total Members</p>
        </div>
        <div className="bg-[#0f1535] border border-amber-500/5 rounded-xl px-4 py-3">
          <p className="text-cyan-400 font-black text-xl">{stats.newThisMonth}</p>
          <p className="text-amber-100/20 text-[10px]">New (30 days)</p>
        </div>
        <div className="bg-[#0f1535] border border-amber-500/5 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            {BOUNTY_RANKS.map(r => (
              <div key={r.name} className="flex items-center gap-0.5" title={r.name}>
                <RankBadge rankName={r.name} color={r.color} size={14} />
                <span className="text-[10px] font-bold" style={{ color: r.color }}>{stats.rankCounts[r.name]}</span>
              </div>
            ))}
          </div>
          <p className="text-amber-100/20 text-[10px] mt-1">Rank Distribution</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          className="bg-[#1a2040] border border-amber-500/10 rounded-lg px-4 py-2 text-sm text-amber-100 placeholder-amber-100/20 flex-1 max-w-xs focus:outline-none focus:border-amber-500/30"
        />
        <button onClick={handleSearch} className="bg-amber-500/10 text-amber-400 font-bold px-4 py-2 rounded-lg text-sm hover:bg-amber-500/20">
          Search
        </button>
        {search && (
          <button onClick={() => { setSearch(""); setPage(1); fetchCustomers(1, ""); }} className="text-amber-100/30 hover:text-amber-100/60 text-xs px-3">
            Clear
          </button>
        )}
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-[32px_1fr_100px_90px_80px_90px] gap-3 px-4 py-2 text-[10px] text-amber-100/30 font-bold uppercase tracking-wider">
        <span />
        <span>Member</span>
        <span>Rank</span>
        <span className="text-right">Total Spent</span>
        <span className="text-center">Orders</span>
        <span className="text-center">Joined</span>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-amber-100/20 text-sm">No members found</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {customers.map((customer, i) => {
            const rank = getRankBySpent(customer.totalSpent);
            return (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                onClick={() => setSelectedId(customer.id)}
                className="grid grid-cols-1 md:grid-cols-[32px_1fr_100px_90px_80px_90px] gap-3 items-center bg-[#0f1535] border border-amber-500/5 hover:border-amber-500/20 rounded-xl px-4 py-3 cursor-pointer transition-colors group"
              >
                {/* Rank Badge */}
                <div className="hidden md:block">
                  <RankBadge rankName={rank.name} color={rank.color} size={28} />
                </div>

                {/* Name + Email */}
                <div className="min-w-0">
                  <p className="text-amber-100 font-bold text-sm truncate group-hover:text-amber-400 transition-colors">
                    {customer.displayName || "—"}
                  </p>
                  <p className="text-amber-100/30 text-[10px] truncate">{customer.email}</p>
                </div>

                {/* Rank */}
                <span className="text-xs font-bold" style={{ color: rank.color }}>
                  {rank.name}
                  {rank.discount > 0 && <span className="text-amber-100/20 ml-1">-{rank.discount}%</span>}
                </span>

                {/* Total Spent */}
                <span className="text-amber-400 font-bold text-sm text-right">
                  ฿{formatPrice(customer.totalSpent)}
                </span>

                {/* Orders */}
                <span className="text-amber-100/50 text-sm text-center">{customer.orderCount}</span>

                {/* Joined */}
                <span className="text-amber-100/30 text-xs text-center">
                  {new Date(customer.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" })}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-amber-100/30 hover:text-amber-100/60 disabled:opacity-20 text-sm px-3 py-1"
          >
            ← Prev
          </button>
          <span className="text-amber-100/40 text-xs">Page {page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-amber-100/30 hover:text-amber-100/60 disabled:opacity-20 text-sm px-3 py-1"
          >
            Next →
          </button>
        </div>
      )}

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {selectedId && (
          <CustomerModal
            customerId={selectedId}
            onClose={() => setSelectedId(null)}
            onUpdated={() => fetchCustomers()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
