import { NextResponse, type NextRequest } from "next/server";

const BLOCKED_UA_PATTERNS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /scrape/i,
  /curl/i,
  /wget/i,
  /python-requests/i,
  /httpx/i,
  /axios/i,
  /node-fetch/i,
  /go-http-client/i,
  /java\//i,
  /perl/i,
  /ruby/i,
  /scrapy/i,
  /phantomjs/i,
  /headlesschrome/i,
  /selenium/i,
  /puppeteer/i,
  /playwright/i,
  /slurp/i,
  /baiduspider/i,
  /yandex/i,
  /sogou/i,
  /semrush/i,
  /ahrefs/i,
  /mj12bot/i,
  /dotbot/i,
  /petalbot/i,
  /bytespider/i,
  /gptbot/i,
  /chatgpt-user/i,
  /ccbot/i,
  /anthropic-ai/i,
  /claudebot/i,
  /cohere-ai/i,
  /facebookexternalhit/i,
  /twitterbot/i,
];

// Allow specific bots (search engines you want indexed by)
const ALLOWED_UA_PATTERNS = [/googlebot/i, /bingbot/i];

// Simple in-memory rate limiter
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60; // requests per window
const RATE_WINDOW = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

// Periodic cleanup to prevent memory leak (guarded against duplicate intervals)
let cleanupStarted = false;
if (!cleanupStarted) {
  cleanupStarted = true;
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateMap) {
      if (now > entry.resetAt) rateMap.delete(ip);
    }
  }, RATE_WINDOW);
}

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Allow specific bots (search indexing)
  if (ALLOWED_UA_PATTERNS.some((p) => p.test(ua))) {
    return NextResponse.next();
  }

  // Block known bad bots/scrapers
  if (BLOCKED_UA_PATTERNS.some((p) => p.test(ua))) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Block empty user agents (likely automated)
  if (!ua || ua.length < 10) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Rate limiting
  if (isRateLimited(ip)) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Robots-Tag", "noai, noimageai");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
