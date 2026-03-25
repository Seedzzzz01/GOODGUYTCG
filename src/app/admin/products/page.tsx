"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/constants";
import ProductModal from "@/components/admin/ProductModal";

interface Product {
  id: string;
  name: string;
  code: string;
  slug: string;
  description: string;
  image: string;
  boxCount: number;
  pricePerBox: number;
  stock: number;
  status: string;
  releaseDate: string;
  packsPerBox: number;
  cardsPerPack: number;
  category: string | null;
  islandTheme: Record<string, unknown> | null;
}

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  IN_STOCK: { bg: "bg-emerald-500/15", text: "text-emerald-400", label: "In Stock" },
  PRE_ORDER: { bg: "bg-yellow-500/15", text: "text-yellow-400", label: "Pre-Order" },
  SOLD_OUT: { bg: "bg-red-500/15", text: "text-red-400", label: "Sold Out" },
};

const CATEGORY_LABEL: Record<string, string> = {
  BOOSTER: "Booster",
  EXTRA: "Extra",
  PREMIUM: "Premium",
  STARTER: "Starter",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [modalProduct, setModalProduct] = useState<Product | null | undefined>(undefined); // undefined = closed, null = add, Product = edit

  const fetchProducts = () => {
    setLoading(true);
    fetch("/api/products")
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (statusFilter && p.status !== statusFilter) return false;
      if (categoryFilter && p.category !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.code.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [products, search, statusFilter, categoryFilter]);

  const stats = useMemo(() => ({
    total: products.length,
    inStock: products.filter(p => p.status === "IN_STOCK").length,
    preOrder: products.filter(p => p.status === "PRE_ORDER").length,
    soldOut: products.filter(p => p.status === "SOLD_OUT").length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 3).length,
  }), [products]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-amber-400">Products</h1>
          <p className="text-amber-100/30 text-xs mt-0.5">{stats.total} total products</p>
        </div>
        <button
          onClick={() => setModalProduct(null)}
          className="bg-amber-500 hover:bg-amber-400 text-[#0a0e27] font-black px-5 py-2.5 rounded-xl transition-colors text-sm flex items-center gap-2"
        >
          <span className="text-lg">+</span> Add Product
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: "Total", value: stats.total, color: "text-amber-400" },
          { label: "In Stock", value: stats.inStock, color: "text-emerald-400" },
          { label: "Pre-Order", value: stats.preOrder, color: "text-yellow-400" },
          { label: "Sold Out", value: stats.soldOut, color: "text-red-400" },
          { label: "Low Stock", value: stats.lowStock, color: "text-orange-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#0f1535] border border-amber-500/5 rounded-xl px-3 py-2.5 text-center">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-amber-100/20 text-[10px]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Search name or code..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#1a2040] border border-amber-500/10 rounded-lg px-4 py-2 text-sm text-amber-100 placeholder-amber-100/20 w-56 focus:outline-none focus:border-amber-500/30"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#1a2040] border border-amber-500/10 rounded-lg px-3 py-2 text-sm text-amber-100"
        >
          <option value="">All Status</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="PRE_ORDER">Pre-Order</option>
          <option value="SOLD_OUT">Sold Out</option>
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="bg-[#1a2040] border border-amber-500/10 rounded-lg px-3 py-2 text-sm text-amber-100"
        >
          <option value="">All Categories</option>
          <option value="BOOSTER">Booster</option>
          <option value="EXTRA">Extra Booster</option>
          <option value="PREMIUM">Premium</option>
          <option value="STARTER">Starter</option>
        </select>
        {(search || statusFilter || categoryFilter) && (
          <button
            onClick={() => { setSearch(""); setStatusFilter(""); setCategoryFilter(""); }}
            className="text-amber-100/30 hover:text-amber-100/60 text-xs font-bold px-3 py-2"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Product Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-amber-100/20 text-sm">No products found</p>
        </div>
      ) : (
        <>
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[48px_1fr_80px_90px_80px_90px_60px] gap-3 px-4 py-2 text-[10px] text-amber-100/30 font-bold uppercase tracking-wider">
            <span />
            <span>Product</span>
            <span>Category</span>
            <span className="text-right">Price</span>
            <span className="text-center">Stock</span>
            <span className="text-center">Status</span>
            <span />
          </div>

          {/* Rows */}
          <div className="space-y-1.5">
            {filtered.map((product, i) => {
              const badge = STATUS_BADGE[product.status] || STATUS_BADGE.IN_STOCK;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
                  onClick={() => setModalProduct(product)}
                  className="grid grid-cols-1 md:grid-cols-[48px_1fr_80px_90px_80px_90px_60px] gap-3 items-center bg-[#0f1535] border border-amber-500/5 hover:border-amber-500/20 rounded-xl px-4 py-3 cursor-pointer transition-colors group"
                >
                  {/* Thumbnail */}
                  <div className="hidden md:block relative w-10 h-10 rounded-lg overflow-hidden bg-[#1a2040] flex-shrink-0">
                    {product.image && (
                      <Image src={product.image} alt="" fill className="object-cover" />
                    )}
                  </div>

                  {/* Name + Code */}
                  <div className="min-w-0">
                    <p className="text-amber-100 font-bold text-sm truncate group-hover:text-amber-400 transition-colors">
                      {product.name}
                    </p>
                    <p className="text-amber-100/30 text-[10px]">{product.code}</p>
                  </div>

                  {/* Category */}
                  <span className="text-amber-100/40 text-xs">
                    {product.category ? CATEGORY_LABEL[product.category] || product.category : "—"}
                  </span>

                  {/* Price */}
                  <span className="text-amber-400 font-bold text-sm text-right">
                    ฿{formatPrice(product.pricePerBox)}
                  </span>

                  {/* Stock */}
                  <div className="text-center">
                    <span className={`text-sm font-bold ${
                      product.stock === 0 ? "text-red-400" :
                      product.stock <= 3 ? "text-orange-400" :
                      "text-emerald-400"
                    }`}>
                      {product.stock}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="text-center">
                    <span className={`${badge.bg} ${badge.text} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Edit button */}
                  <button
                    onClick={e => { e.stopPropagation(); setModalProduct(product); }}
                    className="text-amber-100/20 hover:text-amber-400 text-xs font-bold transition-colors text-right"
                  >
                    Edit
                  </button>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalProduct !== undefined && (
          <ProductModal
            product={modalProduct}
            onClose={() => setModalProduct(undefined)}
            onSaved={() => { setModalProduct(undefined); fetchProducts(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
