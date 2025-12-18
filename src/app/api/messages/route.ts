import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Message, { IMessage } from '@/models/Message';
import Chat from '@/models/Chat';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const chatId = searchParams.get('chatId');

        if (chatId) {
            const messages = await Message.find({ chatId }).sort({ timestamp: 1 });
            return NextResponse.json({ success: true, data: messages });
        }

        const messages = await Message.find({}).sort({ timestamp: -1 }).limit(100);
        return NextResponse.json({ success: true, data: messages });
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
        const createdMessage = await Message.create(body);
        // Handle both single document and array cases
        const message = Array.isArray(createdMessage) ? createdMessage[0] : createdMessage;

        // Update chat's lastMessageId
        await Chat.findByIdAndUpdate((message as IMessage).chatId, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            lastMessageId: (message as any)._id,
            updatedAt: new Date(),
        });

        return NextResponse.json({ success: true, data: message }, { status: 201 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
