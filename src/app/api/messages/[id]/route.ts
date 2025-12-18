import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Message from '@/models/Message';

// PATCH: Edit a message
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();

        const messageId = params.id;
        const { content, userId } = await req.json();

        // Find message
        const message = await Message.findById(messageId);

        if (!message) {
            return NextResponse.json(
                { success: false, message: 'Message not found' },
                { status: 404 }
            );
        }

        // Only allow sender to edit
        if (message.senderId !== userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 403 }
            );
        }

        // Update message
        message.content = content;
        message.isEdited = true;
        message.editedAt = new Date();
        await message.save();

        return NextResponse.json({ success: true, data: message });

    } catch (error: unknown) {
        console.error('Error editing message:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to edit message' },
            { status: 500 }
        );
    }
}

// DELETE: Delete a message
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();

        const messageId = params.id;
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const deleteFor = searchParams.get('deleteFor') as 'me' | 'everyone' || 'me';

        // Find message
        const message = await Message.findById(messageId);

        if (!message) {
            return NextResponse.json(
                { success: false, message: 'Message not found' },
                { status: 404 }
            );
        }

        // "Delete for everyone" only allowed for sender
        if (deleteFor === 'everyone' && message.senderId !== userId) {
            return NextResponse.json(
                { success: false, message: 'Only sender can delete for everyone' },
                { status: 403 }
            );
        }

        if (deleteFor === 'everyone') {
            // Mark as deleted for everyone
            message.isDeleted = true;
            message.deletedAt = new Date();
            message.deletedFor = 'everyone';
            message.content = 'This message was deleted';
            await message.save();
        } else {
            // For "delete for me", we'd typically store in a separate collection
            // For simplicity, just return success (client hides it)
            // In production, create a "deleted_messages" collection with userId + messageId
        }

        return NextResponse.json({ success: true, data: message });

    } catch (error: unknown) {
        console.error('Error deleting message:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete message' },
            { status: 500 }
        );
    }
}
