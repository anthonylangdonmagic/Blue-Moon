import { getDatabase, saveDatabase } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const email = body.email?.trim().toLowerCase();
        const password = body.password?.trim();

        console.log(`[Signup Attempt] Email: ${email}`);

        // Check for critical env vars
        if (!process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
            console.error("[Signup Error] Missing Google Credentials in Env");
            return NextResponse.json({ error: "Server Configuration Error: Missing Credentials" }, { status: 500 });
        }

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const db = await getDatabase();
        if (!db.users) db.users = [];

        const existingUser = db.users.find((u) => u.email.toLowerCase() === email);

        if (existingUser) {
            console.log(`[Signup Failed] User already exists: ${email}`);
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        const hashedPassword = await hashPassword(password);
        const newUser = {
            id: uuidv4(),
            email,
            password_hash: hashedPassword,
            role: 'user' as const,
            created_at: new Date().toISOString(),
        };

        db.users.push(newUser);

        try {
            await saveDatabase(db);
            console.log(`[Signup Success] User created: ${email}`);
        } catch (dbError: any) {
            console.error("[Signup Error] Failed to save to database:", dbError);
            // Return specific error for debugging
            const errorMessage = dbError?.message || "Unknown error";
            return NextResponse.json({ error: `Failed to save account: ${errorMessage}` }, { status: 500 });
        }

        await createSession(newUser.id, newUser.email, newUser.role);

        return NextResponse.json({ success: true, role: newUser.role });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
