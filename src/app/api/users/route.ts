import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const phone = searchParams.get('phone');
        const search = searchParams.get('search');
        const userId = searchParams.get('id');

        // Get specific user by ID
        if (userId) {
            const user = await User.findById(userId).select('-twoFactorSecret -sessions');
            if (!user) {
                return NextResponse.json(
                    { success: false, message: 'User not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json({ success: true, data: user });
        }

        // Get user by phone number
        if (phone) {
            const user = await User.findOne({ phone }).select('-twoFactorSecret -sessions');
            if (!user) {
                return NextResponse.json(
                    { success: false, message: 'User not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json({ success: true, data: user });
        }

        // Search users by name or username
        if (search) {
            const users = await User.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { username: { $regex: search, $options: 'i' } }
                ]
            })
                .select('-twoFactorSecret -sessions')
                .limit(50);

            return NextResponse.json({ success: true, data: users });
        }

        // Get all users (limit for safety)
        const users = await User.find({})
            .select('-twoFactorSecret -sessions')
            .limit(100)
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: users });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const { phone, name, email, username, avatar, about } = body;

        if (!phone) {
            return NextResponse.json(
                { success: false, message: 'Phone number is required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return NextResponse.json({ success: true, data: existingUser });
        }

        // Check username uniqueness if provided
        if (username) {
            const userWithUsername = await User.findOne({ username });
            if (userWithUsername) {
                return NextResponse.json(
                    { success: false, message: 'Username already taken' },
                    { status: 409 }
                );
            }
        }

        const user = await User.create({
            phone,
            name: name || 'New User',
            email,
            username,
            avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${phone}`,
            about: about || "Hey there! I'm using ChatFresh",
            status: 'online',
            lastSeen: new Date(),
            isVerified: false
        });

        return NextResponse.json({ success: true, data: user }, { status: 201 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const { userId, ...updates } = body;

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'User ID is required' },
                { status: 400 }
            );
        }

        // Check username uniqueness if being updated
        if (updates.username) {
            const userWithUsername = await User.findOne({
                username: updates.username,
                _id: { $ne: userId }
            });
            if (userWithUsername) {
                return NextResponse.json(
                    { success: false, message: 'Username already taken' },
                    { status: 409 }
                );
            }
        }

        // Don't allow updating sensitive fields
        delete updates.twoFactorSecret;
        delete updates.twoFactorEnabled;
        delete updates.sessions;

        const user = await User.findByIdAndUpdate(
            userId,
            { ...updates, updatedAt: new Date() },
            { new: true }
        ).select('-twoFactorSecret -sessions');

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: user });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
