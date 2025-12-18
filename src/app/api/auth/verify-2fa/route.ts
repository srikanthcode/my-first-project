import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const { phoneNumber, pin } = await request.json();

        if (!phoneNumber || !pin) {
            return NextResponse.json(
                { success: false, message: 'Phone number and PIN are required' },
                { status: 400 }
            );
        }

        // Normalize phone number if needed (assuming stored format)
        const normalizedPhone = phoneNumber.replace(/[\s-]/g, '');

        // Find user
        const user = await User.findOne({ phone: normalizedPhone });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // If 2FA is not strictly enabled but they are calling this, maybe they just enabled it?
        // But logic says we only call this if 2FA IS enabled.
        if (!user.twoFactorEnabled) {
            return NextResponse.json({
                success: true,
                message: '2FA verification skipped (not enabled)',
                user
            });
        }

        // Verify PIN
        // In a real app, use bcrypt.compare(pin, user.twoFactorPin)
        if (user.twoFactorPin !== pin) {
            return NextResponse.json(
                { success: false, message: 'Invalid 2FA PIN' },
                { status: 400 }
            );
        }

        // Create session entry
        const session = {
            deviceId: 'web-' + Math.random().toString(36).substring(7), // Simple ID generation
            platform: 'Web',
            ip: request.headers.get('x-forwarded-for') || 'unknown',
            deviceName: request.headers.get('user-agent')?.slice(0, 30) || 'Unknown Device'
        };

        user.sessions.push(session);
        await user.save();

        return NextResponse.json({
            success: true,
            message: '2FA Verified Successfully',
            user,
            sessionId: session.deviceId
        });

    } catch (error) {
        console.error('2FA Verification Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
