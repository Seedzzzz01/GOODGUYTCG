import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl mb-4">🏴‍☠️</p>
        <h1 className="text-4xl font-black text-amber-400 mb-2">404</h1>
        <p className="text-amber-100/60 text-lg mb-1">เกาะนี้ไม่มีอยู่บนแผนที่</p>
        <p className="text-amber-100/30 text-sm mb-8">The page you&apos;re looking for doesn&apos;t exist</p>
        <Link
          href="/"
          className="inline-block bg-amber-500 hover:bg-amber-400 text-[#0a0e27] font-black px-8 py-3 rounded-full transition-colors"
        >
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
}
