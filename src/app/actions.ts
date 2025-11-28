"use server";

import { cookies } from "next/headers";
import { getDatabase, saveDatabase } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

// Event Password Protection
export async function verifyEventPassword(formData: FormData) {
    const password = formData.get("password") as string;
    const correctPassword = process.env.EVENT_PASSWORD;

    if (password === correctPassword) {
        (await cookies()).set("event_access", "true", { httpOnly: true, path: "/" });
        return { success: true };
    }

    return { success: false, error: "Incorrect password" };
}

// Subscribe
export async function subscribeToEvents(formData: FormData) {
    const email = formData.get("email") as string;

    if (!email) return { success: false, error: "Email is required" };

    const db = await getDatabase();

    // Check if already subscribed
    if (db.subscribers.some(s => s.email === email)) {
        return { success: true, message: "You are already subscribed!" };
    }

    db.subscribers.push({
        id: uuidv4(),
        email,
        created_at: new Date().toISOString()
    });

    await saveDatabase(db);

    return { success: true, message: "Subscribed successfully!" };
}

// Comments - Disabled for now
export async function addComment(formData: FormData) {
    return { success: false, error: "Comments are disabled" };
}

export async function deleteComment(formData: FormData) {
    return { success: false, error: "Comments are disabled" };
}

// Old Admin Actions - Deprecated/No-op or Redirected
// These were used by the old admin components. 
// We keep the signatures to prevent build errors but they won't do anything useful 
// or will return errors if called. The new Admin UI uses API routes.

export async function createPost(formData: FormData) {
    return { success: false, error: "Please use the new Admin Dashboard" };
}

export async function updateAbout(formData: FormData) {
    return { success: false, error: "Please use the new Admin Dashboard" };
}

export async function createEvent(formData: FormData) {
    return { success: false, error: "Please use the new Admin Dashboard" };
}

export async function sendEventBlast(formData: FormData) {
    return { success: false, error: "Feature temporarily unavailable" };
}

export async function signOut() {
    // This was for Supabase auth. 
    // New auth uses cookies, handled by /api/auth/logout
    return { success: true };
}
