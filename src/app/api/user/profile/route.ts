import { getDatabase, saveDatabase } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { NextResponse } from "next/server";

// We need to import uploadFile from drive.ts. 
// Let's check drive.ts exports first. It exports uploadFile.
import { uploadFile } from "@/lib/storage/drive";

export async function POST(request: Request) {
    try {
        const session = await verifySession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("avatar") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Upload to Google Drive
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `avatar-${session.userId}-${Date.now()}`;
        const driveFile = await uploadFile(buffer, fileName, file.type, process.env.GOOGLE_DRIVE_FOLDER_ID);

        if (!driveFile || !driveFile.webViewLink) {
            return NextResponse.json({ error: "Failed to upload to Drive" }, { status: 500 });
        }

        // Update Database
        const db = await getDatabase();
        if (!db.users) db.users = [];

        const userIndex = db.users.findIndex(u => u.id === session.userId);
        if (userIndex === -1) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Use webContentLink for direct download/display if possible, or webViewLink
        // Drive links are tricky for <img> tags. 
        // Usually webContentLink is for downloading. 
        // We might need a proxy or use the thumbnail link if available, but uploadFile returns webViewLink.
        // Let's use webContentLink if available, else webViewLink.
        // Actually, our uploadFile function requests 'id, webViewLink, webContentLink'.
        // Note: webContentLink might force download. 
        // For images, we often use `https://lh3.googleusercontent.com/d/${fileId}` hack or similar.
        // But let's try using the link returned.

        // Better yet, let's construct a viewable link using the ID.
        // https://drive.google.com/thumbnail?id=${fileId}&sz=w1000

        const avatarUrl = `https://drive.google.com/thumbnail?id=${driveFile.id}&sz=w400`;

        db.users[userIndex].avatar_url = avatarUrl;
        await saveDatabase(db);

        return NextResponse.json({ success: true, avatarUrl });

    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const session = await verifySession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();
    const user = db.users?.find(u => u.id === session.userId);

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
        user: {
            email: user.email,
            role: user.role,
            avatar_url: user.avatar_url
        }
    });
}
