/**
 * Simple in-memory rate limiter.
 * For production with multiple instances, use Redis-backed rate limiting.
 */
const store = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of store) {
      if (now > val.resetAt) store.delete(key);
    }
  }, 5 * 60 * 1000);
}

interface RateLimitResult {
  limited: boolean;
  remaining: number;
  resetIn: number; // seconds
}

export function rateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 60 * 1000 // 1 minute
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: maxRequests - 1, resetIn: Math.ceil(windowMs / 1000) };
  }

  entry.count++;

  if (entry.count > maxRequests) {
    return {
      limited: true,
      remaining: 0,
      resetIn: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  return {
    limited: false,
    remaining: maxRequests - entry.count,
    resetIn: Math.ceil((entry.resetAt - now) / 1000),
  };
}

/** Get IP from request headers */
export function getIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
