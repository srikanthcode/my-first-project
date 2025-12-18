import { NextRequest, NextResponse } from 'next/server';
import { GroupService } from '@/services/group-service';
import Group from '@/models/Group';
import dbConnect from '@/lib/dbConnect';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const group = await Group.findById(params.id);
        if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: group });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const body = await req.json();
        const userId = req.headers.get('x-user-id'); // Extract from auth

        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Check permission
        const hasPermission = await GroupService.hasPermission(params.id, userId, 'changeInfo');
        if (!hasPermission) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const group = await Group.findByIdAndUpdate(params.id, body, { new: true });
        return NextResponse.json({ success: true, data: group });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
