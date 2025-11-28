"use client";

import { FeedItem } from "./FeedItem";
import { EventItem } from "./EventItem";
import { VideoFeed } from "./VideoFeed";
import { useEffect, useState } from "react";

type Tab = "all" | "essays" | "videos" | "events";

export function Feed() {
    const [activeTab, setActiveTab] = useState<Tab>("all");
    const [posts, setPosts] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const res = await fetch('/api/content');
                const data = await res.json();

                if (data.posts) setPosts(data.posts);
                if (data.events) setEvents(data.events);
            } catch (error) {
                console.error("Failed to fetch content", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const filteredContent = () => {
        switch (activeTab) {
            case "essays":
                return posts.filter(p => p.type === "essay" || p.type === "long_form").map(p => ({ ...p, _type: 'post' }));
            case "videos":
                return posts.filter(p => p.media_url && (p.media_url.match(/\.(mp4|webm|ogg|mov)$/i) || !p.media_url.match(/\.(jpg|jpeg|png|gif|webp)$/i))).map(p => ({ ...p, _type: 'post' }));
            case "events":
                return events.map(e => ({ ...e, _type: 'event' }));
            case "all":
            default:
                return posts.map(p => ({ ...p, _type: 'post' }));
        }
    };

    const content = filteredContent();

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Tabs */}
            <div className="flex items-center justify-center space-x-2 mb-8 overflow-x-auto pb-2">
                {(["all", "essays", "videos", "events"] as Tab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${activeTab === tab
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center py-20 text-slate-500 animate-pulse">
                    Loading...
                </div>
            ) : content.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                    <p>No content found in this category.</p>
                </div>
            ) : activeTab === "videos" ? (
                <VideoFeed videos={content as any[]} />
            ) : (
                <div className="space-y-6">
                    {content.map((item: any) => (
                        item._type === 'event' ? (
                            <EventItem key={item.id} event={item} />
                        ) : (
                            <FeedItem key={item.id} post={item} />
                        )
                    ))}
                </div>
            )}
        </div>
    );
}

