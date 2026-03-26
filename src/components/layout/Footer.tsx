import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#060919] border-t border-amber-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🧭</span>
              <span className="text-amber-400 font-black text-xl tracking-wider">
                LUCKY TCG THAILAND
              </span>
            </div>
            <p className="text-amber-100/40 text-sm leading-relaxed mb-4">
              การ์ด One Piece ของแท้ 100% นำเข้าจากญี่ปุ่น
              <br />
              ส่งทั่วไทย 1-3 วัน แพ็คกันกระแทก
            </p>
            {/* Trust line */}
            <div className="flex flex-wrap gap-2 text-[10px] text-amber-100/30">
              <span className="bg-amber-500/5 px-2 py-0.5 rounded">✅ ของแท้ Bandai</span>
              <span className="bg-amber-500/5 px-2 py-0.5 rounded">🔄 คืนใน 7 วัน</span>
              <span className="bg-amber-500/5 px-2 py-0.5 rounded">🔒 ชำระเงินปลอดภัย</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-amber-400 font-bold mb-4 text-sm tracking-wider uppercase">
              Navigation
            </h3>
            <div className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/shop", label: "Shop" },
                { href: "/cards", label: "Cards" },
                { href: "/tools", label: "Tools" },
                { href: "/blog", label: "Blog" },
                { href: "/membership", label: "Membership" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-amber-100/40 hover:text-amber-400 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-amber-400 font-bold mb-4 text-sm tracking-wider uppercase">
              Help & Policies
            </h3>
            <div className="space-y-2">
              {[
                { href: "/faq", label: "FAQ คำถามที่พบบ่อย" },
                { href: "/faq#จัดส่ง", label: "นโยบายจัดส่ง" },
                { href: "/faq#คืน/เปลี่ยน", label: "นโยบายคืน/เปลี่ยน" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-amber-100/40 hover:text-amber-400 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-amber-400 font-bold mb-4 text-sm tracking-wider uppercase">
              Contact Us
            </h3>
            <div className="space-y-2.5 text-sm text-amber-100/40">
              <a href="https://line.me/R/ti/p/@luckytcgthailand" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                <span className="text-[#06C755]">💬</span> LINE: @luckytcgthailand
              </a>
              <a href="mailto:support@luckytcgthailand.com" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                <span>✉️</span> support@luckytcgthailand.com
              </a>
              <a href="https://instagram.com/luckytcgthailand" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                <span>📸</span> Instagram: @luckytcgthailand
              </a>
              <a href="https://facebook.com/luckytcgthailand" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                <span>📘</span> Facebook: LUCKY TCG THAILAND
              </a>
              <p className="text-amber-100/20 text-xs mt-2">
                เวลาทำการ: ทุกวัน 9:00 - 21:00
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-amber-100/20 text-xs">
            &copy; {new Date().getFullYear()} LUCKY TCG THAILAND Store. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-amber-100/20 text-[10px]">
            <span>PromptPay</span>
            <span>•</span>
            <span>Mobile Banking</span>
            <span>•</span>
            <span>Kerry Express</span>
            <span>•</span>
            <span>Flash Express</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
