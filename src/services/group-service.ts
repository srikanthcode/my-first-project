import Group, { IGroup } from '@/models/Group';
import GroupMember, { IGroupMember, GroupRole } from '@/models/GroupMember';
import User from '@/models/User';

export class GroupService {

    // Create a new group/channel
    static async createGroup(data: {
        name: string;
        type: 'group' | 'supergroup' | 'channel';
        ownerId: string;
        description?: string;
        avatar?: string;
        participants?: string[]; // Initial members
    }): Promise<IGroup> {
        // 1. Create Group Document
        const group = await Group.create({
            name: data.name,
            type: data.type,
            ownerId: data.ownerId,
            description: data.description,
            avatar: data.avatar,
            participants: [data.ownerId, ...(data.participants || [])]
        });

        // 2. Add Owner as Member
        await GroupMember.create({
            groupId: group._id,
            userId: data.ownerId,
            role: 'owner',
            permissions: {
                canPost: true,
                canMedia: true,
                canAddMembers: true,
                canPin: true,
                canDeleteMessages: true
            }
        });

        // Create System Message
        const Message = (await import('@/models/Message')).default;
        await Message.create({
            chatId: group._id,
            senderId: data.ownerId,
            type: 'system',
            content: `created the ${data.type}`,
            timestamp: new Date()
        });

        // 3. Add initial participants as members
        if (data.participants && data.participants.length > 0) {
            const memberDocs = data.participants.map(userId => ({
                groupId: group._id,
                userId: userId,
                role: 'member',
                invitedBy: data.ownerId
            }));
            await GroupMember.insertMany(memberDocs);
        }

        return group;
    }

    // Add a member to a group
    static async addMember(groupId: string, userId: string, addedBy: string): Promise<void> {
        // Check permissions of addedBy (omitted for brevity, assume middleware checked it)

        await GroupMember.create({
            groupId,
            userId,
            role: 'member',
            invitedBy: addedBy
        });

        // Update flattened participants array
        await Group.findByIdAndUpdate(groupId, {
            $addToSet: { participants: userId }
        });

        // Create System Message
        const Message = (await import('@/models/Message')).default;
        await Message.create({
            chatId: groupId,
            senderId: addedBy, // Or a system ID
            type: 'system',
            content: 'added a new member',
            timestamp: new Date()
        });
    }

    // Remove member (Kick/Leave)
    static async removeMember(groupId: string, userId: string): Promise<void> {
        await GroupMember.deleteOne({ groupId, userId });
        await Group.findByIdAndUpdate(groupId, {
            $pull: { participants: userId }
        });
    }

    // Update Role
    static async updateMemberRole(groupId: string, userId: string, role: GroupRole): Promise<void> {
        await GroupMember.findOneAndUpdate(
            { groupId, userId },
            { role }
        );
    }

    // Check Permissions
    static async hasPermission(groupId: string, userId: string, permission: string): Promise<boolean> {
        const member = await GroupMember.findOne({ groupId, userId });
        if (!member) return false;

        // Owners and Admins generally have high privileges
        if (member.role === 'owner') return true;
        if (member.role === 'admin' && permission !== 'deleteGroup') return true;

        // Check specific permission override
        if (member.permissions && (member.permissions as any)[permission] !== undefined) {
            return (member.permissions as any)[permission];
        }

        // Fallback to Group Default Settings
        const group = await Group.findById(groupId);
        if (!group) return false;

        return (group.settings.permissions as any)[permission] ?? false;
    }

    static async getGroupMembers(groupId: string, limit = 50, skip = 0) {
        return await GroupMember.find({ groupId })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name avatar status'); // Assuming User model has these
        // Note: In real app, might need manual lookup if referencing User collection strictly
    }
}
