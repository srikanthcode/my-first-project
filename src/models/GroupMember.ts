import { Schema, model, models } from 'mongoose';

export type GroupRole = 'owner' | 'admin' | 'moderator' | 'member' | 'restricted';

export interface IGroupMember {
    groupId: string;
    userId: string;
    role: GroupRole;
    permissions?: {
        canPost?: boolean;
        canMedia?: boolean;
        canAddMembers?: boolean;
        canPin?: boolean;
        canDeleteMessages?: boolean;
    };
    joinedAt: Date;
    invitedBy?: string;
}

const GroupMemberSchema = new Schema<IGroupMember>(
    {
        groupId: { type: String, required: true, index: true },
        userId: { type: String, required: true, index: true },
        role: {
            type: String,
            enum: ['owner', 'admin', 'moderator', 'member', 'restricted'],
            default: 'member',
            required: true
        },
        permissions: {
            canPost: { type: Boolean }, // If set, overrides Group default
            canMedia: { type: Boolean },
            canAddMembers: { type: Boolean },
            canPin: { type: Boolean },
            canDeleteMessages: { type: Boolean },
        },
        invitedBy: { type: String },
        joinedAt: { type: Date, default: Date.now },
    }
);

// Compound index to ensure a user is in a group only once
GroupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });

export default models.GroupMember || model<IGroupMember>('GroupMember', GroupMemberSchema);
