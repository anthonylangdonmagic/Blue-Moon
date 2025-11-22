"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function verifyEventPassword(formData: FormData) {
    const password = formData.get("password") as string;
    const correctPassword = process.env.EVENT_PASSWORD;

    if (password === correctPassword) {
        (await cookies()).set("event_access", "true", { httpOnly: true, path: "/" });
        return { success: true };
    }

    return { success: false, error: "Incorrect password" };
}

export async function subscribeToEvents(formData: FormData) {
    const email = formData.get("email") as string;

    if (!email) return { success: false, error: "Email is required" };

    const { error } = await supabase
        .from("subscribers")
        .insert([{ email }]);

    if (error) {
        if (error.code === "23505") { // Unique violation
            return { success: true, message: "You are already subscribed!" };
        }
        return { success: false, error: error.message };
    }

    // Optional: Send welcome email via Resend
    try {
        await resend.emails.send({
            from: "Blue Moon <onboarding@resend.dev>", // Update with verified domain later
            to: email,
            subject: "Welcome to the Inner Circle",
            html: "<p>You have unlocked the events list. Stay tuned.</p>",
        });
    } catch (e) {
        console.error("Failed to send welcome email", e);
    }

    return { success: true, message: "Subscribed successfully!" };
}

export async function addComment(formData: FormData) {
    const postId = formData.get("postId") as string;
    const authorName = formData.get("authorName") as string;
    const content = formData.get("content") as string;

    if (!postId || !authorName || !content) {
        return { success: false, error: "All fields are required" };
    }

    const { error } = await supabase
        .from("comments")
        .insert([{ post_id: postId, author_name: authorName, content }]);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function createPost(formData: FormData) {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const type = formData.get("type") as string;
    const mediaUrl = formData.get("mediaUrl") as string;
    const publishedAt = formData.get("publishedAt") as string;

    // Basic validation
    if (!title || !slug) {
        return { success: false, error: "Title and Slug are required" };
    }

    const { error } = await supabase
        .from("posts")
        .insert([{
            title,
            slug,
            content,
            type,
            media_url: mediaUrl || null,
            published_at: publishedAt || new Date().toISOString(),
        }]);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function updateAbout(formData: FormData) {
    const bio = formData.get("bio") as string;
    const imageUrl = formData.get("imageUrl") as string;

    const { error } = await supabase
        .from("about_page")
        .upsert({ id: 1, bio, image_url: imageUrl, updated_at: new Date().toISOString() });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function deleteComment(formData: FormData) {
    const commentId = formData.get("commentId") as string;

    const { error } = await supabase
        .from("comments")
        .update({ deleted: true })
        .eq("id", commentId);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function createEvent(formData: FormData) {
    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const isPrivate = formData.get("isPrivate") === "on";

    const { error } = await supabase
        .from("events")
        .insert([{
            title,
            date,
            location,
            description,
            is_private: isPrivate,
        }]);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function sendEventBlast(formData: FormData) {
    const eventId = formData.get("eventId") as string;

    // Fetch event details
    const { data: event, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

    if (eventError || !event) {
        return { success: false, error: "Event not found" };
    }

    // Fetch subscribers
    const { data: subscribers, error: subError } = await supabase
        .from("subscribers")
        .select("email")
        .eq("active", true);

    if (subError || !subscribers || subscribers.length === 0) {
        return { success: false, error: "No subscribers found" };
    }

    const emailList = subscribers.map(s => s.email);

    try {
        await resend.emails.send({
            from: "Blue Moon <events@resend.dev>",
            to: "delivered@resend.dev",
            bcc: emailList,
            subject: `New Event: ${event.title}`,
            html: `
        <h1>${event.title}</h1>
        <p><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p>${event.description}</p>
        <p><a href="${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('.supabase.co', '.vercel.app')}/events">View Event</a></p>
      `,
        });
    } catch (e) {
        return { success: false, error: "Failed to send emails" };
    }

    return { success: true, message: `Blast sent to ${emailList.length} subscribers!` };
}
