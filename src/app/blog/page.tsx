"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { BLOG_POSTS } from "@/data/blog-posts";

const CATEGORIES = ["all", "beginner", "history", "collecting", "strategy", "news"] as const;
const CAT_LABELS: Record<string, string> = {
  all: "ทั้งหมด",
  beginner: "มือใหม่",
  history: "ประวัติ",
  collecting: "สะสม",
  strategy: "เทคนิค",
  news: "ข่าวสาร",
};

import { useState } from "react";

export default function BlogPage() {
  const [category, setCategory] = useState<string>("all");

  const filtered = category === "all"
    ? BLOG_POSTS
    : BLOG_POSTS.filter(p => p.category === category);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/sections/captain-desk.jpg" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#0a0e27]/60" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center"
        >
          <span className="text-amber-400/60 text-xs tracking-[0.3em] uppercase">
            Captain&apos;s Log
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-amber-100 mt-2">
            Blog
          </h1>
          <p className="text-amber-100/40 mt-2 text-sm">
            บทความ เทคนิค และข่าวสารวงการ One Piece Card Game
          </p>
          <div className="w-16 h-0.5 bg-amber-500/40 mx-auto mt-4" />
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-amber-500 text-[#0a0e27]"
                  : "bg-amber-500/10 text-amber-400/60 hover:bg-amber-500/20"
              }`}
            >
              {CAT_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Featured post */}
        {filtered.length > 0 && category === "all" && (
          <Link href={`/blog/${filtered[0].slug}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="relative rounded-2xl overflow-hidden mb-8 group cursor-pointer"
            >
              <div className="relative h-64 sm:h-80">
                <Image src={filtered[0].coverImage} alt={filtered[0].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-[#0a0e27]/50 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                  {CAT_LABELS[filtered[0].category] || filtered[0].category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-amber-100 mt-1 group-hover:text-amber-400 transition-colors">
                  {filtered[0].title}
                </h2>
                <p className="text-amber-100/50 text-sm mt-2 line-clamp-2">
                  {filtered[0].excerpt}
                </p>
                <div className="flex items-center gap-3 mt-3 text-xs text-amber-100/30">
                  <span>{filtered[0].date}</span>
                  <span>·</span>
                  <span>{filtered[0].readTime} min read</span>
                </div>
              </div>
            </motion.div>
          </Link>
        )}

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(category === "all" ? filtered.slice(1) : filtered).map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-[#0f1535] border border-amber-500/5 hover:border-amber-500/20 rounded-2xl overflow-hidden transition-all group cursor-pointer h-full flex flex-col"
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-amber-500/90 text-[#0a0e27] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {CAT_LABELS[post.category] || post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-amber-100 font-bold text-sm group-hover:text-amber-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-amber-100/30 text-xs mt-2 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-[10px] text-amber-100/20">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime} min</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-amber-100/30">
            <p className="text-4xl mb-4">📝</p>
            <p>ยังไม่มีบทความในหมวดนี้</p>
          </div>
        )}
      </div>
    </div>
  );
}
