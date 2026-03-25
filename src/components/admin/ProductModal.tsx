"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductData {
  id?: string;
  name: string;
  code: string;
  slug?: string;
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
  islandTheme: {
    name: string;
    color: string;
    gradient: string;
    description: string;
    arc: string;
    keyCharacters: string[];
  } | null;
}

const EMPTY_PRODUCT: ProductData = {
  name: "", code: "", description: "", image: "",
  boxCount: 1, pricePerBox: 2200, stock: 0, status: "IN_STOCK",
  releaseDate: "", packsPerBox: 24, cardsPerPack: 6,
  category: "BOOSTER",
  islandTheme: { name: "", color: "#e74c3c", gradient: "from-red-900 via-red-700 to-orange-500", description: "", arc: "", keyCharacters: [] },
};

const TABS = ["Basic", "Box", "Image", "Theme"] as const;

interface Props {
  product?: ProductData | null; // null = add mode
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductModal({ product, onClose, onSaved }: Props) {
  const isEdit = !!product?.id;
  const [form, setForm] = useState<ProductData>(product ? { ...EMPTY_PRODUCT, ...product } : { ...EMPTY_PRODUCT });
  const [tab, setTab] = useState<typeof TABS[number]>("Basic");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [charInput, setCharInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (field: string, value: unknown) => setForm(f => ({ ...f, [field]: value }));
  const setTheme = (field: string, value: unknown) =>
    setForm(f => ({ ...f, islandTheme: { ...(f.islandTheme || EMPTY_PRODUCT.islandTheme!), [field]: value } }));

  const handleSave = async () => {
    setError("");
    if (!form.name.trim()) { setError("Name is required"); return; }
    if (!form.code.trim()) { setError("Code is required"); return; }
    if (!form.pricePerBox || form.pricePerBox <= 0) { setError("Price must be > 0"); return; }

    setSaving(true);

    const payload = {
      ...form,
      islandTheme: form.islandTheme?.name ? form.islandTheme : null,
      category: form.category || null,
    };

    try {
      const url = isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Save failed");
        setSaving(false);
        return;
      }

      onSaved();
    } catch {
      setError("Network error");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!isEdit) return;
    setSaving(true);
    const res = await fetch(`/api/admin/products/${product!.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Delete failed");
      setSaving(false);
      return;
    }
    onSaved();
  };

  const handleImageUpload = async (file: File) => {
    if (!isEdit) {
      // For new products, just preview locally
      const url = URL.createObjectURL(file);
      set("image", url);
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch(`/api/admin/products/${product!.id}/upload-image`, {
      method: "POST",
      body: fd,
    });

    if (res.ok) {
      const data = await res.json();
      set("image", data.imageUrl);
    }
    setUploading(false);
  };

  const addCharacter = () => {
    const name = charInput.trim();
    if (!name) return;
    const current = form.islandTheme?.keyCharacters || [];
    if (!current.includes(name)) {
      setTheme("keyCharacters", [...current, name]);
    }
    setCharInput("");
  };

  const removeCharacter = (idx: number) => {
    const current = form.islandTheme?.keyCharacters || [];
    setTheme("keyCharacters", current.filter((_, i) => i !== idx));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[85vh] bg-[#0f1535] border border-amber-500/20 rounded-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/10">
            <h2 className="text-xl font-black text-amber-400">
              {isEdit ? "Edit Product" : "Add Product"}
            </h2>
            <button onClick={onClose} className="text-amber-100/30 hover:text-amber-100/60 text-2xl leading-none">&times;</button>
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
                {tab === t && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {tab === "Basic" && (
              <>
                <Row>
                  <Field label="Product Name *" className="flex-1">
                    <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Romance Dawn" className={inputCls} />
                  </Field>
                  <Field label="Code *" className="w-28">
                    <input value={form.code} onChange={e => set("code", e.target.value)} placeholder="OP-01" className={inputCls} />
                  </Field>
                </Row>
                <Field label="Description">
                  <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} placeholder="ชุดแรกของ One Piece Card Game..." className={inputCls} />
                </Field>
                <Row>
                  <Field label="Price per Box (฿) *" className="flex-1">
                    <input type="number" value={form.pricePerBox} onChange={e => set("pricePerBox", +e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Stock" className="flex-1">
                    <input type="number" value={form.stock} onChange={e => set("stock", +e.target.value)} className={inputCls} />
                  </Field>
                </Row>
                <Row>
                  <Field label="Status" className="flex-1">
                    <select value={form.status} onChange={e => set("status", e.target.value)} className={inputCls}>
                      <option value="IN_STOCK">In Stock</option>
                      <option value="PRE_ORDER">Pre-Order</option>
                      <option value="SOLD_OUT">Sold Out</option>
                    </select>
                  </Field>
                  <Field label="Category" className="flex-1">
                    <select value={form.category || ""} onChange={e => set("category", e.target.value || null)} className={inputCls}>
                      <option value="">None</option>
                      <option value="BOOSTER">Booster</option>
                      <option value="EXTRA">Extra Booster</option>
                      <option value="PREMIUM">Premium</option>
                      <option value="STARTER">Starter</option>
                    </select>
                  </Field>
                </Row>
              </>
            )}

            {tab === "Box" && (
              <>
                <Row>
                  <Field label="Box Count" className="flex-1">
                    <input type="number" value={form.boxCount} onChange={e => set("boxCount", +e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Packs per Box" className="flex-1">
                    <input type="number" value={form.packsPerBox} onChange={e => set("packsPerBox", +e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Cards per Pack" className="flex-1">
                    <input type="number" value={form.cardsPerPack} onChange={e => set("cardsPerPack", +e.target.value)} className={inputCls} />
                  </Field>
                </Row>
                <Field label="Release Date">
                  <input type="date" value={form.releaseDate} onChange={e => set("releaseDate", e.target.value)} className={inputCls} />
                </Field>
              </>
            )}

            {tab === "Image" && (
              <div className="flex flex-col items-center gap-4">
                {/* Preview */}
                <div className="relative w-48 h-48 bg-[#1a2040] rounded-xl overflow-hidden border-2 border-dashed border-amber-500/20">
                  {form.image ? (
                    <Image src={form.image} alt="Product" fill className="object-contain" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-amber-100/20 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* Upload */}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
                >
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>

                {/* Or paste URL */}
                <div className="w-full">
                  <Field label="Or enter image URL">
                    <input value={form.image} onChange={e => set("image", e.target.value)} placeholder="/images/sets/op01.png" className={inputCls} />
                  </Field>
                </div>
              </div>
            )}

            {tab === "Theme" && (
              <>
                <p className="text-amber-100/30 text-xs mb-2">
                  Island theme for the Grand Line map. Optional — leave blank if not needed.
                </p>
                <Row>
                  <Field label="Island Name" className="flex-1">
                    <input value={form.islandTheme?.name || ""} onChange={e => setTheme("name", e.target.value)} placeholder="Foosha Village" className={inputCls} />
                  </Field>
                  <Field label="Color" className="w-28">
                    <div className="flex gap-2 items-center">
                      <input type="color" value={form.islandTheme?.color || "#e74c3c"} onChange={e => setTheme("color", e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />
                      <input value={form.islandTheme?.color || ""} onChange={e => setTheme("color", e.target.value)} className={inputCls + " flex-1"} />
                    </div>
                  </Field>
                </Row>
                <Field label="Arc Name">
                  <input value={form.islandTheme?.arc || ""} onChange={e => setTheme("arc", e.target.value)} placeholder="Romance Dawn Arc" className={inputCls} />
                </Field>
                <Field label="Island Description">
                  <textarea value={form.islandTheme?.description || ""} onChange={e => setTheme("description", e.target.value)} rows={2} placeholder="A quiet coastal village..." className={inputCls} />
                </Field>
                <Field label="Gradient Classes">
                  <input value={form.islandTheme?.gradient || ""} onChange={e => setTheme("gradient", e.target.value)} placeholder="from-red-900 via-red-700 to-orange-500" className={inputCls} />
                </Field>
                <Field label="Key Characters">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(form.islandTheme?.keyCharacters || []).map((c, i) => (
                      <span key={i} className="bg-amber-500/10 text-amber-400 text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        {c}
                        <button onClick={() => removeCharacter(i)} className="text-amber-100/30 hover:text-red-400">&times;</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={charInput}
                      onChange={e => setCharInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCharacter())}
                      placeholder="Monkey D. Luffy"
                      className={inputCls + " flex-1"}
                    />
                    <button onClick={addCharacter} className="bg-amber-500/10 text-amber-400 px-3 rounded-lg text-sm font-bold hover:bg-amber-500/20">
                      Add
                    </button>
                  </div>
                </Field>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-amber-500/10 flex items-center gap-3">
            {error && <p className="text-red-400 text-xs flex-1">{error}</p>}
            <div className="flex-1" />

            {isEdit && !deleteConfirm && (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="text-red-400/50 hover:text-red-400 text-xs font-bold transition-colors mr-2"
              >
                Delete
              </button>
            )}
            {deleteConfirm && (
              <div className="flex items-center gap-2 mr-2">
                <span className="text-red-400 text-xs">Confirm delete?</span>
                <button onClick={handleDelete} disabled={saving} className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
                  Yes, Delete
                </button>
                <button onClick={() => setDeleteConfirm(false)} className="text-amber-100/30 text-xs">
                  Cancel
                </button>
              </div>
            )}

            <button onClick={onClose} className="text-amber-100/30 hover:text-amber-100/60 text-sm font-bold px-4 py-2">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-[#0a0e27] font-black px-6 py-2 rounded-xl transition-colors text-sm"
            >
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Helpers ───

const inputCls = "w-full bg-[#1a2040] border border-amber-500/10 rounded-lg px-3 py-2 text-sm text-amber-100 placeholder-amber-100/20 focus:outline-none focus:border-amber-500/30 transition-colors";

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-amber-100/50 text-xs font-medium mb-1">{label}</label>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-3">{children}</div>;
}
