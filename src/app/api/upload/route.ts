import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/storage/drive';
import { verifySession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    const session = await verifySession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadFile(buffer, file.name, file.type, folderId);

    return NextResponse.json({
        url: result.webViewLink,
        downloadUrl: result.webContentLink,
        id: result.id
    });
}
