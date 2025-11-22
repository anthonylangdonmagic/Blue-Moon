"use client";

import { updateAbout } from "@/app/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AboutForm({ initialBio, initialImage }: { initialBio: string; initialImage: string }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        const result = await updateAbout(formData);

        if (result.success) {
            router.refresh();
            setLoading(false);
            alert("About page updated successfully!");
        } else {
            setError(result.error || "Failed to update about page");
            setLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6 max-w-2xl">
            <div>
                <label className="block text-sm text-slate-400 mb-1">Profile Image URL</label>
                <input
                    type="url"
                    name="imageUrl"
                    defaultValue={initialImage}
                    placeholder="https://..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm text-slate-400 mb-1">Bio</label>
                <textarea
                    name="bio"
                    defaultValue={initialBio}
                    rows={10}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
                {loading ? "Saving..." : "Save Changes"}
            </button>
        </form>
    );
}
