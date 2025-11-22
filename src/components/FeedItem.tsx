"use client";

import { motion } from "framer-motion";
import { MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { Comments } from "./Comments";

interface Post {
    id: string;
    slug: string | null;
    title: string | null;
    content: string | null;
    type: "short_form" | "essay" | "long_form";
    media_url: string | null;
    published_at: string | null;
    allow_comments: boolean;
}

export function FeedItem({ post }: { post: Post }) {
    const isEssay = post.type === "essay" || post.type === "long_form";

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6 mb-6 hover:border-blue-500/30 transition-colors"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
                    <div>
                        <h3 className="font-semibold text-slate-100">Anthony</h3>
                        <p className="text-xs text-slate-400">
                            {new Date(post.published_at || Date.now()).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                {isEssay && (
                    <span className="px-3 py-1 text-xs font-medium text-blue-200 bg-blue-900/30 rounded-full border border-blue-800">
                        Essay
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="mb-4">
                {post.title && <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>}
                <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </div>
            </div>

            {/* Media (TikTok/Video) */}
            {post.media_url && (
                <div className="mb-4 rounded-lg overflow-hidden border border-slate-800">
                    {/* Simple iframe for now, can be enhanced for specific platforms */}
                    <iframe
                        src={post.media_url}
                        className="w-full aspect-video"
                        allowFullScreen
                        title="Embedded Media"
                    />
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-6 text-slate-400 mb-2">
                <button className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                    <Share2 size={18} />
                    <span className="text-sm">Share</span>
                </button>
            </div>

            {/* Comments Section */}
            {post.allow_comments && <Comments postId={post.id} />}
        </motion.article>
    );
}
