import { NextRequest, NextResponse } from 'next/server';
import { sendEmailOTP } from '@/lib/send-mail';
import { checkIPRateLimit, checkPhoneRateLimit } from '@/lib/rate-limiter';
import { otpStore } from '@/lib/otp-store';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        // Validate email
        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Email format validation
        const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Rate limiting
        const ipRateLimit = checkPhoneRateLimit(email); // Using email as identifier
        if (!ipRateLimit.allowed) {
            return NextResponse.json(
                { error: ipRateLimit.reason || 'Too many requests' },
                { status: 429 }
            );
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with 10-minute expiration
        const expiresAt = Date.now() + 10 * 60 * 1000;
        otpStore.set(email, { otp, expiresAt });

        // Send OTP via email
        try {
            await sendEmailOTP(email, otp);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return NextResponse.json(
                { error: 'Failed to send OTP email. Please check your email configuration.' },
                { status: 500 }
            );
        }

        console.log(`✅ OTP sent to ${email}: ${otp} (expires in 10 min)`);

        return NextResponse.json({
            success: true,
            message: `OTP sent successfully to ${email}`,
            email,
            // For development only - remove in production
            ...(process.env.NODE_ENV === 'development' && { devOtp: otp })
        });

    } catch (error) {
        console.error('Send OTP error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
