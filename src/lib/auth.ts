import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.GOOGLE_PRIVATE_KEY || "secret";
const key = new TextEncoder().encode(secretKey);

export interface SessionPayload {
    userId: string;
    email: string;
    role: 'admin' | 'user';
    expiresAt: Date;
}

export async function createSession(userId: string, email: string, role: 'admin' | 'user') {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const session = await new SignJWT({ userId, email, role, expiresAt })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(key);

    (await cookies()).set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
    });
}

export async function verifySession() {
    const cookie = (await cookies()).get("session")?.value;
    if (!cookie) return null;

    try {
        const { payload } = await jwtVerify(cookie, key, {
            algorithms: ["HS256"],
        });
        return payload as unknown as SessionPayload;
    } catch (error) {
        return null;
    }
}

export async function deleteSession() {
    (await cookies()).delete("session");
}
