import { SAMPLE_SETS } from "@/lib/constants";
import { BLOG_POSTS } from "@/data/blog-posts";
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXTAUTH_URL || "https://goodguytcg.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${BASE_URL}/shop`, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/cards`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  const productPages = SAMPLE_SETS.map((set) => ({
    url: `${BASE_URL}/shop/${set.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPages = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...blogPages];
}
