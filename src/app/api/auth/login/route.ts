import { getDatabase } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const db = await getDatabase();
        const user = db.users?.find((u) => u.email === email);

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isValid = await verifyPassword(password, user.password_hash);

        if (!isValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        await createSession(user.id, user.email, user.role);

        return NextResponse.json({ success: true, role: user.role });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
