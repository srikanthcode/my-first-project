import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Chat from '@/models/Chat';
import Message from '@/models/Message';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: NextRequest) {
    try {
        await dbConnect();

        // Check if database already has data
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            return NextResponse.json({
                success: true,
                message: 'Database already seeded',
            });
        }

        // Create users
        const users = await User.insertMany([
            {
                name: 'You',
                email: 'you@example.com',
                phone: '+1234567890',
                avatar: undefined,
                about: 'Hey there! I am using Chat Fresh',
                status: 'online',
            },
            {
                name: 'Alice Johnson',
                email: 'alice@example.com',
                phone: '+1234567891',
                avatar: undefined,
                about: 'Living my best life 🌟',
                status: 'online',
            },
            {
                name: 'Bob Smith',
                email: 'bob@example.com',
                phone: '+1234567892',
                avatar: undefined,
                about: 'Busy coding...',
                status: 'offline',
                lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
            },
            {
                name: 'Carol Williams',
                email: 'carol@example.com',
                phone: '+1234567893',
                avatar: undefined,
                about: 'Coffee lover ☕',
                status: 'online',
            },
        ]);

        // Create chats
        const chat1 = await Chat.create({
            type: 'private',
            participants: [users[0]._id.toString(), users[1]._id.toString()],
            isPinned: true,
        });

        const chat2 = await Chat.create({
            type: 'private',
            participants: [users[0]._id.toString(), users[2]._id.toString()],
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _chat3 = await Chat.create({
            type: 'private',
            participants: [users[0]._id.toString(), users[3]._id.toString()],
        });

        // Create messages
        const messages = await Message.insertMany([
            {
                chatId: chat1._id.toString(),
                senderId: users[1]._id.toString(),
                content: 'Hey! How are you doing?',
                timestamp: new Date(Date.now() - 60 * 60 * 1000),
                status: 'read',
            },
            {
                chatId: chat1._id.toString(),
                senderId: users[0]._id.toString(),
                content: 'I\'m doing great! Thanks for asking. How about you?',
                timestamp: new Date(Date.now() - 55 * 60 * 1000),
                status: 'read',
            },
            {
                chatId: chat1._id.toString(),
                senderId: users[1]._id.toString(),
                content: 'Pretty good! Just finished a big project at work 🎉',
                timestamp: new Date(Date.now() - 50 * 60 * 1000),
                status: 'read',
            },
            {
                chatId: chat1._id.toString(),
                senderId: users[0]._id.toString(),
                content: 'Congratulations! That\'s awesome!',
                timestamp: new Date(Date.now() - 5 * 60 * 1000),
                status: 'delivered',
            },
            {
                chatId: chat2._id.toString(),
                senderId: users[2]._id.toString(),
                content: 'Did you see the latest update?',
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
                status: 'read',
            },
        ]);

        // Update chats with lastMessageId
        await Chat.findByIdAndUpdate(chat1._id, { lastMessageId: messages[3]._id });
        await Chat.findByIdAndUpdate(chat2._id, { lastMessageId: messages[4]._id });

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully',
            data: {
                users: users.length,
                chats: 3,
                messages: messages.length,
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
