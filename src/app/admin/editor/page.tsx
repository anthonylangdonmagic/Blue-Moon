'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EditorPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'short_form',
        content: '',
        media_url: '',
        slug: '',
    });

    useEffect(() => {
        if (id) {
            fetch(`/api/content?slug=${id}`) // Note: API currently fetches by slug or type, might need adjustment for ID fetching if we want exact edit. 
            // Actually, let's just fetch all and find it for simplicity in this "simple" backend
            fetch('/api/content').then(res => res.json()).then(data => {
                const post = data.posts.find((p: any) => p.id === id);
                if (post) setFormData(post);
            });
        }
    }, [id]);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.[0]) return;

        setUploading(true);
        const file = e.target.files[0];
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data,
            });
            const json = await res.json();
            if (json.url) {
                setFormData({ ...formData, media_url: json.url });
            }
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id || undefined,
                    ...formData,
                    slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                }),
            });

            if (res.ok) {
                router.push('/admin');
            } else {
                alert('Failed to save');
            }
        } catch (error) {
            alert('Error saving');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm">
            <h1 className="text-2xl font-bold mb-6">{id ? 'Edit Post' : 'New Post'}</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                    >
                        <option value="short_form">Short Video</option>
                        <option value="long_form">Long Video</option>
                        <option value="essay">Essay</option>
                        <option value="post">Post</option>
                        <option value="event">Event</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Media (Video/Image)</label>
                    <div className="mt-1 flex items-center space-x-4">
                        <input
                            type="file"
                            accept="video/*,image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                        />
                        {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                    </div>
                    {formData.media_url && (
                        <div className="mt-2 text-xs text-gray-500 break-all">
                            Current: {formData.media_url}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Content / Description</label>
                    <textarea
                        rows={5}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}
