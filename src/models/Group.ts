import { Schema, model, models } from 'mongoose';

export interface IGroupSettings {
    joinType: 'open' | 'invite' | 'request';
    slowMode: number; // in seconds
    onlyAdminsCanPost: boolean;
    permissions: {
        sendMessages: boolean;
        sendMedia: boolean;
        addMembers: boolean;
        pinMessages: boolean;
        changeInfo: boolean;
    };
}

export interface IGroup {
    _id?: string;
    type: 'private' | 'group' | 'supergroup' | 'channel';
    name?: string;
    description?: string;
    avatar?: string;
    participants: string[]; // Keep for small groups/private, but rely on GroupMember for large ones
    ownerId: string;
    lastMessageId?: string;
    settings: IGroupSettings;
    createdAt?: Date;
    updatedAt?: Date;
}

const GroupSchema = new Schema<IGroup>(
    {
        type: {
            type: String,
            enum: ['private', 'group', 'supergroup', 'channel'],
            required: true,
            default: 'group' // Default for backward compatibility
        },
        name: { type: String },
        description: { type: String },
        avatar: { type: String },
        participants: [{ type: String }], // Warning: For supergroups, do not load this fully
        ownerId: { type: String, required: true },
        lastMessageId: { type: String },
        settings: {
            joinType: { type: String, enum: ['open', 'invite', 'request'], default: 'invite' },
            slowMode: { type: Number, default: 0 },
            onlyAdminsCanPost: { type: Boolean, default: false },
            permissions: {
                sendMessages: { type: Boolean, default: true },
                sendMedia: { type: Boolean, default: true },
                addMembers: { type: Boolean, default: true },
                pinMessages: { type: Boolean, default: false },
                changeInfo: { type: Boolean, default: true },
            }
        }
    },
    {
        timestamps: true,
    }
);

export default models.Group || model<IGroup>('Group', GroupSchema);
