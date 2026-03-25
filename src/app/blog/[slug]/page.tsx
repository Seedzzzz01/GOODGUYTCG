"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { BLOG_POSTS } from "@/data/blog-posts";

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">📝</p>
          <h1 className="text-2xl font-bold text-amber-100 mb-2">ไม่พบบทความ</h1>
          <Link href="/blog" className="text-amber-400 hover:text-amber-300">← กลับหน้า Blog</Link>
        </div>
      </div>
    );
  }

  // Find related posts (same category, exclude current)
  const related = BLOG_POSTS.filter(p => p.category === post.category && p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Cover */}
      <div className="relative h-64 sm:h-80">
        <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-[#0a0e27]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 max-w-4xl mx-auto">
          <Link href="/blog" className="text-amber-400/60 text-xs hover:text-amber-400 transition-colors">
            ← Blog
          </Link>
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider ml-4">
            {post.category}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-black text-amber-100 mb-3">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-amber-100/30 mb-8">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime} min read</span>
            <span>·</span>
            <span>by {post.author}</span>
          </div>

          {/* Article Content */}
          <article className="prose prose-invert prose-amber max-w-none mb-12">
            {post.sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="mb-8"
              >
                {section.heading && (
                  <h2 className="text-xl font-black text-amber-400 mb-3 flex items-center gap-2">
                    {section.icon && <span>{section.icon}</span>}
                    {section.heading}
                  </h2>
                )}
                {section.paragraphs.map((p, j) => (
                  <p key={j} className="text-amber-100/70 leading-relaxed mb-3 text-sm">
                    {p}
                  </p>
                ))}
                {section.list && (
                  <ul className="space-y-2 mt-3">
                    {section.list.map((item, k) => (
                      <li key={k} className="flex gap-2 text-amber-100/60 text-sm">
                        <span className="text-amber-500 mt-1 flex-shrink-0">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.tip && (
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 mt-4">
                    <p className="text-amber-400 text-xs font-bold mb-1">💡 Tip</p>
                    <p className="text-amber-100/60 text-sm">{section.tip}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </article>

          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap gap-2 mb-10">
              {post.tags.map(tag => (
                <span key={tag} className="bg-amber-500/5 text-amber-400/50 text-xs px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-6 text-center mb-10">
            <p className="text-amber-400 font-bold mb-2">สนใจเริ่มสะสมการ์ด?</p>
            <p className="text-amber-100/40 text-sm mb-4">เลือกซื้อ Box ของแท้จาก GOODGUY TCG ส่งตรงถึงบ้าน</p>
            <Link href="/shop">
              <motion.button whileHover={{ scale: 1.05 }} className="bg-amber-500 hover:bg-amber-400 text-[#0a0e27] font-black px-6 py-2.5 rounded-full transition-colors text-sm">
                ดูสินค้าทั้งหมด
              </motion.button>
            </Link>
          </div>

          {/* Related Posts */}
          {related.length > 0 && (
            <div className="mb-12">
              <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-4">
                บทความที่เกี่ยวข้อง
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map(r => (
                  <Link key={r.slug} href={`/blog/${r.slug}`}>
                    <motion.div whileHover={{ y: -3 }} className="bg-[#0f1535] border border-amber-500/5 hover:border-amber-500/20 rounded-xl overflow-hidden transition-all group">
                      <div className="relative h-28 overflow-hidden">
                        <Image src={r.coverImage} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-3">
                        <p className="text-amber-100 text-xs font-bold group-hover:text-amber-400 transition-colors line-clamp-2">
                          {r.title}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
