"use client";

import { useEffect, useState } from 'react';

/**
 * WebOTP API Hook for auto-reading SMS OTP
 * Works on Android Chrome/Edge, limited iOS support
 * 
 * Usage:
 * const { otp, isSupported } = useOTPAutoRead();
 * 
 * SMS Format required:
 * Your code is: 123456
 * 
 * @your-domain.com #123456
 */
export function useOTPAutoRead() {
    const [otp, setOtp] = useState<string>('');
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        // Check if WebOTP API is supported
        if ('OTPCredential' in window) {
            setIsSupported(true);

            const abortController = new AbortController();

            // Request OTP from SMS
            navigator.credentials
                .get({
                    // @ts-expect-error - OTPCredential is experimental
                    otp: { transport: ['sms'] },
                    signal: abortController.signal,
                })
                .then((credential) => {
                    const otpCred = credential as { code?: string } | null;
                    if (otpCred?.code) {
                        console.log('📱 OTP auto-read from SMS:', otpCred.code);
                        setOtp(otpCred.code);
                    }
                })
                .catch((error) => {
                    console.log('WebOTP error (this is normal if no SMS):', error);
                });

            // Cleanup
            return () => {
                abortController.abort();
            };
        } else {
            console.log('WebOTP API not supported on this browser');
        }
    }, []);

    return { otp, isSupported };
}

/**
 * Format phone number for display
 * +1234567890 -> +1 (234) 567-8900
 */
export function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 11 && cleaned.startsWith('1')) {
        // US number
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }

    return phone; // Return  as-is for international
}
