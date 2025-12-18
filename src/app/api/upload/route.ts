import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';



export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { success: false, message: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file size (2GB limit)
        const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, message: 'File size exceeds 2GB limit' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${originalName}`;

        // Save to public/uploads directory
        const uploadsDir = join(process.cwd(), 'public', 'uploads');
        const filepath = join(uploadsDir, filename);

        // Write file
        await writeFile(filepath, buffer);

        // Return file URL
        const fileUrl = `/uploads/${filename}`;

        return NextResponse.json({
            success: true,
            data: {
                fileUrl,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type
            }
        });

    } catch (error: unknown) {
        console.error('File upload error:', error);
        return NextResponse.json(
            { success: false, message: 'File upload failed' },
            { status: 500 }
        );
    }
}
