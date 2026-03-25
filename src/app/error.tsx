"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl mb-4">⚓</p>
        <h1 className="text-3xl font-black text-amber-400 mb-2">เกิดข้อผิดพลาด</h1>
        <p className="text-amber-100/40 text-sm mb-8">Something went wrong. Please try again.</p>
        <button
          onClick={reset}
          className="bg-amber-500 hover:bg-amber-400 text-[#0a0e27] font-black px-8 py-3 rounded-full transition-colors"
        >
          ลองใหม่
        </button>
      </div>
    </div>
  );
}
