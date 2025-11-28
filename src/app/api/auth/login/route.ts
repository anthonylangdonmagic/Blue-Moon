import { getDatabase } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const email = body.email?.trim();
        const password = body.password?.trim();

        console.log(`[Login Attempt] Email: ${email}`);

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const db = await getDatabase();
        const user = db.users?.find((u) => u.email === email);

        if (!user) {
            console.log(`[Login Failed] User not found: ${email}`);
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isValid = await verifyPassword(password, user.password_hash);
        console.log(`[Login Debug] User found. Role: ${user.role}. Password Valid: ${isValid}`);

        if (!isValid) {
            console.log(`[Login Failed] Invalid password for: ${email}`);
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        await createSession(user.id, user.email, user.role);

        return NextResponse.json({ success: true, role: user.role });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
