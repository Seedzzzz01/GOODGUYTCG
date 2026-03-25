import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#060919] border-t border-amber-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🧭</span>
              <span className="text-amber-400 font-black text-xl tracking-wider">
                GOODGUY TCG
              </span>
            </div>
            <p className="text-amber-100/40 text-sm leading-relaxed">
              การ์ด One Piece ของแท้ ส่งทั่วไทย
              <br />
              สมัคร Bounty Rank รับส่วนลดทุกออเดอร์
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-amber-400 font-bold mb-4 text-sm tracking-wider uppercase">
              Navigation
            </h3>
            <div className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/shop", label: "Shop" },
                { href: "/cart", label: "Cart" },
                { href: "/profile", label: "Profile" },
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
              Contact
            </h3>
            <div className="space-y-2 text-sm text-amber-100/40">
              <p>LINE: @goodguytcg</p>
              <p>Instagram: @goodguytcg</p>
              <p>Facebook: GOODGUY TCG</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-amber-500/10 text-center text-amber-100/20 text-xs">
          &copy; {new Date().getFullYear()} GOODGUY TCG. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
