"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Camera, Loader2 } from "lucide-react";

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/user/profile")
            .then(res => {
                if (res.ok) return res.json();
                throw new Error("Failed to fetch profile");
            })
            .then(data => {
                setUser(data.user);
                setLoading(false);
            })
            .catch(() => {
                router.push("/login");
            });
    }, [router]);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const res = await fetch("/api/user/profile", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setUser({ ...user, avatar_url: data.avatarUrl });
                router.refresh(); // Refresh to update navbar if it uses server data (it doesn't yet, but good practice)
            } else {
                alert("Failed to upload image");
            }
        } catch (error) {
            console.error(error);
            alert("Error uploading image");
        } finally {
            setUploading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-24 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8">
                        {/* Avatar Section */}
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-800 border-4 border-slate-700 shadow-xl">
                                {user?.avatar_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={user.avatar_url}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                                        <User size={48} />
                                    </div>
                                )}
                            </div>

                            <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white cursor-pointer hover:bg-blue-500 transition-colors shadow-lg">
                                <Camera size={20} />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                />
                            </label>

                            {uploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                    <Loader2 className="animate-spin text-white" size={24} />
                                </div>
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 space-y-6 w-full">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                                <div className="text-white text-lg font-medium">{user?.email}</div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Account Type</label>
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-200 border border-blue-800">
                                    {user?.role === 'admin' ? 'Administrator' : 'Standard User'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
