'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Post {
    id: string;
    title: string;
    type: string;
    media_url?: string;
    published_at: string;
}

export default function AdminDashboard() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        try {
            const res = await fetch('/api/content');
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Failed to fetch posts', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string, type: string) {
        if (!confirm('Are you sure you want to delete this?')) return;

        try {
            const res = await fetch(`/api/content?id=${id}&type=${type}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setPosts(posts.filter((p) => p.id !== id));
            } else {
                alert('Failed to delete');
            }
        } catch (error) {
            alert('Error deleting item');
        }
    }

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">My Content</h1>
                <Link
                    href="/admin/editor"
                    className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                    + Create New
                </Link>
            </div>

            {/* TikTok-style Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {posts.map((post) => (
                    <div key={post.id} className="relative group aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        {/* Media Preview */}
                        {post.media_url ? (
                            post.type === 'short_form' || post.type === 'long_form' ? (
                                <video
                                    src={post.media_url}
                                    className="w-full h-full object-cover"
                                    muted
                                    playsInline
                                    onMouseOver={(e) => e.currentTarget.play()}
                                    onMouseOut={(e) => {
                                        e.currentTarget.pause();
                                        e.currentTarget.currentTime = 0;
                                    }}
                                />
                            ) : (
                                <img
                                    src={post.media_url}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            )
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                No Media
                            </div>
                        )}

                        {/* Overlay Info */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-100 transition-opacity flex flex-col justify-end p-4">
                            <h3 className="text-white font-semibold text-sm line-clamp-2">{post.title}</h3>
                            <p className="text-gray-300 text-xs capitalize">{post.type}</p>

                            {/* Actions */}
                            <div className="flex gap-2 mt-2">
                                <Link
                                    href={`/admin/editor?id=${post.id}`}
                                    className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs py-1.5 rounded text-center backdrop-blur-sm"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(post.id, post.type)}
                                    className="flex-1 bg-red-500/80 hover:bg-red-500 text-white text-xs py-1.5 rounded text-center backdrop-blur-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    No content yet. Click "Create New" to get started.
                </div>
            )}
        </div>
    );
}
