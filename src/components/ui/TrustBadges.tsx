"use client";

/**
 * Reusable trust badges strip for product pages, cart, and checkout.
 */
export default function TrustBadges({ compact = false }: { compact?: boolean }) {
  const badges = [
    { icon: "✅", text: "ของแท้ Bandai JP 100%" },
    { icon: "🚚", text: "ส่งไว 1-3 วัน" },
    { icon: "📦", text: "แพ็คกันกระแทก 2 ชั้น" },
    { icon: "🔄", text: "เปลี่ยน/คืนใน 7 วัน" },
  ];

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {badges.map((b) => (
          <span key={b.text} className="text-amber-100/40 text-[10px] flex items-center gap-1">
            <span>{b.icon}</span> {b.text}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {badges.map((b) => (
        <div key={b.text} className="bg-[#0f1535] border border-amber-500/5 rounded-lg px-3 py-2 text-center">
          <span className="text-lg">{b.icon}</span>
          <p className="text-amber-100/50 text-[10px] mt-0.5">{b.text}</p>
        </div>
      ))}
    </div>
  );
}
