// In-memory OTP storage (use Redis in production)
export const otpStore = new Map<string, { otp: string; expiresAt: number }>();

// Cleanup expired OTPs every 5 minutes
if (typeof window === 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [email, data] of otpStore.entries()) {
            if (data.expiresAt < now) {
                otpStore.delete(email);
            }
        }
    }, 5 * 60 * 1000);
}
