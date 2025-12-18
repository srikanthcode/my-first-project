// Rate limiter utility for OTP requests
// Tracks both IP-based and phone-based limits

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

// In-memory store for rate limiting (use Redis in production)
const ipLimits = new Map<string, RateLimitEntry>();
const phoneLimits = new Map<string, RateLimitEntry>();

// Cleanup expired entries on-demand (compatible with Next.js SSR)
function cleanupExpiredEntries() {
    const now = Date.now();

    for (const [ip, entry] of ipLimits.entries()) {
        if (entry.resetAt < now) {
            ipLimits.delete(ip);
        }
    }

    for (const [phone, entry] of phoneLimits.entries()) {
        if (entry.resetAt < now) {
            phoneLimits.delete(phone);
        }
    }
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
    reason?: string;
}

/**
 * Check if phone number is rate limited
 * Limit: 3 requests per 5 minutes
 */
export function checkPhoneRateLimit(phone: string): RateLimitResult {
    cleanupExpiredEntries(); // Clean up expired entries on-demand
    const limit = 3;
    const windowMs = 5 * 60 * 1000; // 5 minutes
    const now = Date.now();

    const entry = phoneLimits.get(phone);

    if (!entry || entry.resetAt < now) {
        // Create new entry
        const resetAt = now + windowMs;
        phoneLimits.set(phone, { count: 1, resetAt });
        return {
            allowed: true,
            remaining: limit - 1,
            resetAt
        };
    }

    if (entry.count >= limit) {
        return {
            allowed: false,
            remaining: 0,
            resetAt: entry.resetAt,
            reason: `Too many OTP requests. Please try again in ${Math.ceil((entry.resetAt - now) / 1000)} seconds.`
        };
    }

    entry.count++;
    return {
        allowed: true,
        remaining: limit - entry.count,
        resetAt: entry.resetAt
    };
}

/**
 * Check if IP is rate limited
 * Limit: 10 requests per hour
 */
export function checkIPRateLimit(ip: string): RateLimitResult {
    cleanupExpiredEntries(); // Clean up expired entries on-demand
    const limit = 10;
    const windowMs = 60 * 60 * 1000; // 1 hour
    const now = Date.now();

    const entry = ipLimits.get(ip);

    if (!entry || entry.resetAt < now) {
        const resetAt = now + windowMs;
        ipLimits.set(ip, { count: 1, resetAt });
        return {
            allowed: true,
            remaining: limit - 1,
            resetAt
        };
    }

    if (entry.count >= limit) {
        return {
            allowed: false,
            remaining: 0,
            resetAt: entry.resetAt,
            reason: `Too many requests from this IP. Please try again in ${Math.ceil((entry.resetAt - now) / 60000)} minutes.`
        };
    }

    entry.count++;
    return {
        allowed: true,
        remaining: limit - entry.count,
        resetAt: entry.resetAt
    };
}

/**
 * Reset rate limit for a phone number (use after successful verification)
 */
export function resetPhoneRateLimit(phone: string): void {
    phoneLimits.delete(phone);
}

/**
 * Get client IP from request
 */
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    return 'unknown';
}
