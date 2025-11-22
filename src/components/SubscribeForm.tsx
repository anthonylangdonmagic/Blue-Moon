"use client";

import { subscribeToEvents } from "@/app/actions";
import { useState } from "react";

export function SubscribeForm() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setMessage(null);

        const result = await subscribeToEvents(formData);

        if (result.success) {
            setMessage(result.message || "Subscribed!");
            const form = document.getElementById("subscribe-form") as HTMLFormElement;
            if (form) form.reset();
        } else {
            setMessage(result.error || "Failed to subscribe");
        }
        setLoading(false);
    }

    return (
        <form id="subscribe-form" action={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className="flex-1 bg-slate-950 border border-blue-900/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
                {loading ? "..." : "Subscribe"}
            </button>
            {message && <p className="absolute mt-12 text-sm text-blue-200">{message}</p>}
        </form>
    );
}
