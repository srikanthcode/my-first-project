import { NextRequest, NextResponse } from 'next/server';
import { GroupService } from '@/services/group-service';
import dbConnect from '@/lib/dbConnect';
import { useAuthStore } from '@/store/auth-store'; // This is client side, can't use here.
// We need server-side auth extraction. Assuming headers or session.
// For now, I will extract 'x-user-id' header or mock it since we don't have full server auth session set up yet.

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();

        // Mock Auth: In real app, verify JWT/Session
        // For development, we allow passing ownerId or get from header
        const ownerId = req.headers.get('x-user-id') || body.ownerId;

        if (!ownerId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const group = await GroupService.createGroup({
            ...body,
            ownerId
        });

        return NextResponse.json({ success: true, data: group });

    } catch (error: any) {
        console.error('Group Creation Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
