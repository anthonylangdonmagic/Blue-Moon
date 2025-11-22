"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { addComment } from "@/app/actions";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
    id: string;
    author_name: string;
    content: string;
    created_at: string;
    deleted: boolean;
}

export function Comments({ postId }: { postId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchComments();
        }
    }, [isOpen]);

    async function fetchComments() {
        setLoading(true);
        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("post_id", postId)
            .eq("deleted", false)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching comments:", error);
        } else {
            setComments(data || []);
        }
        setLoading(false);
    }

    async function handleAddComment(formData: FormData) {
        const result = await addComment(formData);
        if (result.success) {
            // Optimistic update or re-fetch
            fetchComments();
            // Reset form? The form action handles submission, but we might want to clear inputs.
            // Since we use native form action, we can't easily clear inputs without ref or controlled state.
            // For simplicity, we'll just re-fetch.
            // Actually, we should clear the form.
            const form = document.getElementById(`comment-form-${postId}`) as HTMLFormElement;
            if (form) form.reset();
        } else {
            setError(result.error || "Failed to post comment");
        }
    }

    return (
        <div className="mt-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition-colors text-sm"
            >
                <MessageSquare size={16} />
                <span>{isOpen ? "Hide Comments" : "Show Comments"}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 space-y-4 pl-4 border-l-2 border-slate-800">
                            {loading ? (
                                <p className="text-slate-500 text-sm">Loading comments...</p>
                            ) : comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment.id} className="bg-slate-900/30 p-3 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <span className="font-semibold text-slate-300 text-sm">
                                                {comment.author_name}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm mt-1">{comment.content}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-sm">No comments yet. Be the first.</p>
                            )}

                            {/* Add Comment Form */}
                            <form
                                id={`comment-form-${postId}`}
                                action={handleAddComment}
                                className="mt-4 space-y-3"
                            >
                                <input type="hidden" name="postId" value={postId} />
                                <input
                                    type="text"
                                    name="authorName"
                                    placeholder="Your Name"
                                    required
                                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <div className="relative">
                                    <textarea
                                        name="content"
                                        placeholder="Write a comment..."
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute bottom-2 right-2 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-500 transition-colors"
                                    >
                                        <Send size={14} />
                                    </button>
                                </div>
                                {error && <p className="text-red-400 text-xs">{error}</p>}
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
