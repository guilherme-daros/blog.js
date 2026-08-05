import { headers } from "next/headers";

/**
 * Resolve the caller's IP address from request headers.
 * Safe to call from any server action or route handler.
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * Simple in-process sliding-window rate limiter.
 * Works per-deployment instance (no Redis required).
 * For multi-instance deployments use Upstash Redis instead.
 */

type RateLimitEntry = { count: number; windowStart: number };
const store = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
  /** Max number of requests allowed within the window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
}

/**
 * Returns true when the key has exceeded the rate limit, false otherwise.
 */
export function isRateLimited(key: string, options: RateLimitOptions): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart > options.windowMs) {
    // Start a fresh window
    store.set(key, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;

  if (entry.count > options.limit) {
    return true;
  }

  return false;
}

// Periodically clean up expired entries to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now - entry.windowStart > 60_000) {
        store.delete(key);
      }
    }
  }, 60_000);
}
