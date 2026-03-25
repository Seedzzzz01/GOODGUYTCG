"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/constants";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending", PAYMENT_UPLOADED: "Slip Uploaded",
  PAYMENT_CONFIRMED: "Confirmed", PACKING: "Packing",
  SHIPPED: "Shipped", DELIVERED: "Delivered", CANCELLED: "Cancelled",
};

export default function AdminOrderDetail({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [tracking, setTracking] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrder = () => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); setTracking((data.trackingNumber as string) || ""); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrder(); }, [orderId]);

  const updateStatus = async (status: string) => {
    await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, trackingNumber: tracking }),
    });
    fetchOrder();
  };

  const verifyPayment = async (approved: boolean) => {
    await fetch(`/api/admin/orders/${orderId}/verify-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    fetchOrder();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) return <p className="text-amber-100/30">Order not found</p>;

  const items = (order.items as { productName: string; quantity: number; price: number }[]) || [];
  const proofs = (order.paymentProofs as { imageUrl: string; status: string }[]) || [];

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-black text-amber-400 mb-1">
        {order.orderNumber as string}
      </h1>
      <p className="text-amber-100/30 text-sm mb-6">
        Status: <span className="text-amber-400 font-bold">{STATUS_LABELS[order.status as string]}</span>
      </p>

      <div className="grid gap-4">
        {/* Items */}
        <div className="bg-[#0f1535] border border-amber-500/10 rounded-xl p-5">
          <h3 className="text-amber-400 font-bold text-sm uppercase mb-3">Items</h3>
          {items.map((item, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-amber-500/5 last:border-0">
              <span className="text-amber-100/70 text-sm">{item.productName} x{item.quantity}</span>
              <span className="text-amber-400 text-sm font-bold">฿{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 mt-2 border-t border-amber-500/10">
            <span className="text-amber-100/50 text-sm">Subtotal</span>
            <span className="text-amber-100 font-bold">฿{formatPrice(order.subtotal as number)}</span>
          </div>
          {(order.discountAmount as number) > 0 && (
            <div className="flex justify-between">
              <span className="text-emerald-400 text-sm">Discount ({order.discountRank as string})</span>
              <span className="text-emerald-400 font-bold">-฿{formatPrice(order.discountAmount as number)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg">
            <span className="text-amber-400 font-black">Total</span>
            <span className="text-amber-400 font-black">฿{formatPrice(order.total as number)}</span>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-[#0f1535] border border-amber-500/10 rounded-xl p-5">
          <h3 className="text-amber-400 font-bold text-sm uppercase mb-3">Shipping</h3>
          <p className="text-amber-100/70 text-sm">{order.shippingName as string}</p>
          <p className="text-amber-100/40 text-xs">{order.shippingPhone as string}</p>
          <p className="text-amber-100/40 text-xs">{order.shippingAddress as string} {order.shippingProvince as string} {order.shippingZipcode as string}</p>
        </div>

        {/* Payment Slips */}
        {proofs.length > 0 && (
          <div className="bg-[#0f1535] border border-amber-500/10 rounded-xl p-5">
            <h3 className="text-amber-400 font-bold text-sm uppercase mb-3">Payment Slips</h3>
            <div className="flex gap-3 flex-wrap">
              {proofs.map((proof, i) => (
                <div key={i} className="relative w-40 h-56 rounded-lg overflow-hidden border border-amber-500/10">
                  <Image src={proof.imageUrl} alt="Slip" fill className="object-cover" />
                  <div className={`absolute bottom-0 left-0 right-0 text-center text-[10px] font-bold py-1 ${
                    proof.status === "APPROVED" ? "bg-green-600" : proof.status === "REJECTED" ? "bg-red-600" : "bg-yellow-600"
                  } text-white`}>
                    {proof.status}
                  </div>
                </div>
              ))}
            </div>
            {order.status === "PAYMENT_UPLOADED" && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => verifyPayment(true)}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-2 rounded-lg text-sm transition-colors"
                >
                  Approve Payment
                </button>
                <button
                  onClick={() => verifyPayment(false)}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2 rounded-lg text-sm transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        )}

        {/* Status Actions */}
        <div className="bg-[#0f1535] border border-amber-500/10 rounded-xl p-5">
          <h3 className="text-amber-400 font-bold text-sm uppercase mb-3">Update Status</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {["PAYMENT_CONFIRMED", "PACKING", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
              <motion.button
                key={s}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateStatus(s)}
                disabled={order.status === s}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                  order.status === s
                    ? "bg-amber-500/20 text-amber-400 cursor-default"
                    : "bg-[#1a2040] text-amber-100/50 hover:text-amber-400 hover:bg-amber-500/10"
                }`}
              >
                {STATUS_LABELS[s]}
              </motion.button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Tracking number"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              className="flex-1 bg-[#1a2040] border border-amber-500/10 rounded-lg px-4 py-2 text-sm text-amber-100 placeholder-amber-100/20"
            />
            <button
              onClick={() => updateStatus(order.status as string)}
              className="bg-amber-500 text-[#0a0e27] font-bold px-4 py-2 rounded-lg text-sm"
            >
              Save Tracking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
