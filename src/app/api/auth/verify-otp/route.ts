import { NextRequest, NextResponse } from 'next/server';
import { otpStore } from '@/lib/otp-store';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, otp } = body;

        // Validate inputs
        if (!email || !otp) {
            return NextResponse.json(
                { success: false, error: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        // Check if OTP exists for this email
        const storedData = otpStore.get(email);

        if (!storedData) {
            return NextResponse.json(
                { success: false, error: 'No OTP found for this email. Please request a new one.' },
                { status: 404 }
            );
        }

        // Check if OTP is expired
        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(email);
            return NextResponse.json(
                { success: false, error: 'OTP has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Verify OTP
        if (storedData.otp !== otp.trim()) {
            return NextResponse.json(
                { success: false, error: 'Invalid OTP. Please try again.' },
                { status: 400 }
            );
        }

        // OTP verified successfully - remove it
        otpStore.delete(email);

        console.log(`✅ OTP verified successfully for ${email}`);

        return NextResponse.json({
            success: true,
            message: 'OTP verified successfully',
            email
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
