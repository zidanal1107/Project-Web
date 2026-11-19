import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const limiter =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(3, "1 m"), // 3 percobaan per menit per IP
        prefix: "rl:login",
      })
    : null;

export async function checkRateLimit(key: string) {
  if (!limiter) return { success: true, retryAfter: 0 };

  const result = await limiter.limit(key);
  return {
    success: result.success,
    retryAfter: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
  };
}

export function getClientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}