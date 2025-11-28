"use client";

import { MessageSquare } from "lucide-react";

export function Comments({ postId }: { postId: string }) {
    return (
        <div className="mt-4">
            <button
                className="flex items-center space-x-2 text-slate-500 cursor-not-allowed text-sm"
                disabled
            >
                <MessageSquare size={16} />
                <span>Comments are disabled</span>
            </button>
        </div>
    );
}

