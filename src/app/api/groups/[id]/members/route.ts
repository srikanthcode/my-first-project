import { NextRequest, NextResponse } from 'next/server';
import { GroupService } from '@/services/group-service';
import dbConnect from '@/lib/dbConnect';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const members = await GroupService.getGroupMembers(params.id);
        return NextResponse.json({ success: true, data: members });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const { userId } = await req.json();
        const adminId = req.headers.get('x-user-id');

        if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Check if admin has permission to add members
        const canAdd = await GroupService.hasPermission(params.id, adminId, 'canAddMembers');
        if (!canAdd) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await GroupService.addMember(params.id, userId, adminId);
        return NextResponse.json({ success: true, message: 'Member added' });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
