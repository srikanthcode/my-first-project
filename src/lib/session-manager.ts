import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // 7 days

export interface SessionPayload {
    userId: string;
    phone: string;
    deviceId?: string;
    platform?: string;
}

/**
 * Generate JWT session token
 */
export function generateSessionToken(payload: SessionPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
}

/**
 * Verify and decode JWT token
 */
export function verifySessionToken(token: string): SessionPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as SessionPayload;
        return decoded;
    } catch (error) {
        console.error('Invalid or expired token:', error);
        return null;
    }
}

/**
 * Generate device ID for session tracking
 */
export function generateDeviceId(): string {
    return `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get browser/platform info
 */
export function getPlatformInfo(): string {
    if (typeof window === 'undefined') return 'server';

    const ua = navigator.userAgent;

    if (/android/i.test(ua)) return 'Android';
    if (/iPad|iPhone|iPod/.test(ua)) return 'iOS';
    if (/Windows/.test(ua)) return 'Windows';
    if (/Mac/.test(ua)) return 'MacOS';
    if (/Linux/.test(ua)) return 'Linux';

    return 'Unknown';
}
