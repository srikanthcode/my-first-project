import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Message from '@/models/Message';
import Chat from '@/models/Chat';
import User from '@/models/User';
import Group from '@/models/Group';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const type = searchParams.get('type'); // 'all', 'messages', 'chats', 'users', 'groups'

        if (!query) {
            return NextResponse.json(
                { success: false, message: 'Search query is required' },
                { status: 400 }
            );
        }

        const results: {
            messages: unknown[];
            chats: unknown[];
            users: unknown[];
            groups: unknown[];
        } = {
            messages: [],
            chats: [],
            users: [],
            groups: []
        };

        // Search messages
        if (!type || type === 'all' || type === 'messages') {
            results.messages = await Message.find({
                content: { $regex: query, $options: 'i' },
                isDeleted: { $ne: true }
            })
                .limit(50)
                .sort({ timestamp: -1 });
        }

        // Search users
        if (!type || type === 'all' || type === 'users') {
            results.users = await User.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { username: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } }
                ]
            })
                .select('-twoFactorSecret -sessions')
                .limit(50);
        }

        // Search groups/channels
        if (!type || type === 'all' || type === 'groups') {
            results.groups = await Group.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            })
                .limit(50);
        }

        // Search chats (by participant names)
        if (!type || type === 'all' || type === 'chats') {
            results.chats = await Chat.find()
                .populate({
                    path: 'participants',
                    match: {
                        name: { $regex: query, $options: 'i' }
                    }
                })
                .limit(50);
        }

        return NextResponse.json({ success: true, data: results });

    } catch (error: unknown) {
        console.error('Search error:', error);
        return NextResponse.json(
            { success: false, message: 'Search failed' },
            { status: 500 }
        );
    }
}
