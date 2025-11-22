"use client";

import { createPost } from "@/app/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WritePage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        const result = await createPost(formData);

        if (result.success) {
            router.push("/admin");
            router.refresh();
        } else {
            setError(result.error || "Failed to create post");
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Write New Post</h1>

            <form action={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            required
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Type</label>
                        <select
                            name="type"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="short_form">Short Form</option>
                            <option value="essay">Essay</option>
                            <option value="long_form">Long Form</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Published At</label>
                        <input
                            type="datetime-local"
                            name="publishedAt"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Media URL (TikTok/Video)</label>
                    <input
                        type="url"
                        name="mediaUrl"
                        placeholder="https://..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Content</label>
                    <textarea
                        name="content"
                        rows={12}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                        placeholder="Write your thoughts here..."
                    />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? "Publishing..." : "Publish Post"}
                    </button>
                </div>
            </form>
        </div>
    );
}
