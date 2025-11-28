import { getDatabase, saveDatabase } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const db = await getDatabase();

        if (!db.users) db.users = [];

        const existingUser = db.users.find((u) => u.email === email);

        if (existingUser) {
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
        await saveDatabase(db);

        await createSession(newUser.id, newUser.email, newUser.role);

        return NextResponse.json({ success: true, role: newUser.role });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
