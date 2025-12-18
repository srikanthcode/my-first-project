import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Chat from '@/models/Chat';
import Message from '@/models/Message';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
    try {
        await dbConnect();

        const chats = await Chat.find({}).sort({ updatedAt: -1 });

        // Populate with last message for each chat
        const chatsWithMessages = await Promise.all(
            chats.map(async (chat) => {
                const lastMessage = chat.lastMessageId
                    ? await Message.findById(chat.lastMessageId)
                    : null;

                return {
                    ...chat.toObject(),
                    lastMessage,
                };
            })
        );

        return NextResponse.json({ success: true, data: chatsWithMessages });
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
        const chat = await Chat.create(body);

        return NextResponse.json({ success: true, data: chat }, { status: 201 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
