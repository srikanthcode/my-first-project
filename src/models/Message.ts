import { Schema, model, models } from 'mongoose';

export interface IMessage {
    _id?: string;
    chatId: string;
    senderId: string;
    content: string;
    timestamp: Date;
    status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
    type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'voice';
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    replyTo?: string;
    reactions?: Record<string, string[]>;
    isEdited?: boolean;
    editedAt?: Date;
    isDeleted?: boolean;
    deletedAt?: Date;
    deletedFor?: 'me' | 'everyone';
    viewOnce?: boolean;
    expiresAt?: Date; // For self-destructing messages
    createdAt?: Date;
    updatedAt?: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        _id: { type: String, required: true }, // Support client-generated UUIDs
        chatId: { type: String, required: true, index: true },
        senderId: { type: String, required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        status: { type: String, enum: ['sending', 'sent', 'delivered', 'read', 'failed'], default: 'sent' },
        type: { type: String, enum: ['text', 'image', 'video', 'audio', 'document', 'voice', 'system'], default: 'text' },
        fileUrl: { type: String },
        fileName: { type: String },
        fileSize: { type: Number },
        replyTo: { type: String },
        reactions: { type: Map, of: [String] },
        isEdited: { type: Boolean, default: false },
        editedAt: { type: Date },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
        deletedFor: { type: String, enum: ['me', 'everyone'] },
        viewOnce: { type: Boolean, default: false },
        expiresAt: { type: Date },
    },
    {
        timestamps: true,
    }
);

export default models.Message || model<IMessage>('Message', MessageSchema);
