"use client";

import { deleteComment } from "@/app/actions";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function InboxList({ initialComments }: { initialComments: any[] }) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function handleDelete(commentId: string) {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        setDeletingId(commentId);
        const formData = new FormData();
        formData.append("commentId", commentId);

        const result = await deleteComment(formData);

        if (result.success) {
            router.refresh();
        } else {
            alert("Failed to delete comment");
        }
        setDeletingId(null);
    }

    if (initialComments.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800/50">
                <p>No new comments.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {initialComments.map((comment) => (
                <div key={comment.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-white">{comment.author_name}</h3>
                            <span className="text-xs text-slate-500">
                                {new Date(comment.created_at).toLocaleString()}
                            </span>
                        </div>
                        <p className="text-slate-300 mb-2">{comment.content}</p>
                        <p className="text-xs text-slate-500">
                            On post: <span className="text-blue-400">{comment.posts?.title || "Unknown Post"}</span>
                        </p>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={() => handleDelete(comment.id)}
                            disabled={deletingId === comment.id}
                            className="flex items-center space-x-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Trash2 size={18} />
                            <span className="font-bold">DELETE</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
