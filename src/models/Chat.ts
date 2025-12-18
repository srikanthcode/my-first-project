import { Schema, model, models } from 'mongoose';

export interface IChat {
    _id?: string;
    type: 'private' | 'group';
    name?: string;
    avatar?: string;
    participants: string[];
    lastMessageId?: string;
    unreadCount: number;
    isPinned: boolean;
    isMuted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const ChatSchema = new Schema<IChat>(
    {
        type: { type: String, enum: ['private', 'group'], required: true },
        name: { type: String }, // For group chats
        avatar: { type: String }, // For group chats
        participants: [{ type: String, required: true }],
        lastMessageId: { type: String },
        unreadCount: { type: Number, default: 0 },
        isPinned: { type: Boolean, default: false },
        isMuted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

export default models.Chat || model<IChat>('Chat', ChatSchema);
