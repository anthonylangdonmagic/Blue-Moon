"use client";

import { createEvent, sendEventBlast } from "@/app/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Mail, MapPin } from "lucide-react";

export function EventAdmin({ initialEvents }: { initialEvents: any[] }) {
    const [loading, setLoading] = useState(false);
    const [blastLoading, setBlastLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleCreate(formData: FormData) {
        setLoading(true);
        setError(null);

        const result = await createEvent(formData);

        if (result.success) {
            router.refresh();
            setLoading(false);
            // Reset form
            const form = document.getElementById("create-event-form") as HTMLFormElement;
            if (form) form.reset();
        } else {
            setError(result.error || "Failed to create event");
            setLoading(false);
        }
    }

    async function handleBlast(eventId: string) {
        if (!confirm("Send email blast to all active subscribers?")) return;

        setBlastLoading(eventId);
        const formData = new FormData();
        formData.append("eventId", eventId);

        const result = await sendEventBlast(formData);

        if (result.success) {
            alert(result.message);
        } else {
            alert(result.error || "Failed to send blast");
        }
        setBlastLoading(null);
    }

    return (
        <div className="space-y-12">
            {/* Create Event Form */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                <h2 className="text-xl font-bold text-white mb-4">Create New Event</h2>
                <form id="create-event-form" action={handleCreate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Date & Time</label>
                            <input
                                type="datetime-local"
                                name="date"
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Location</label>
                        <input
                            type="text"
                            name="location"
                            placeholder="e.g. Zoom, or 123 Moon St."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input type="checkbox" name="isPrivate" id="isPrivate" className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="isPrivate" className="text-sm text-slate-400">Private Event (Hidden from public list?)</label>
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Event"}
                    </button>
                </form>
            </div>

            {/* Events List */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4">Manage Events</h2>
                <div className="space-y-4">
                    {initialEvents.map((event) => (
                        <div key={event.id} className="bg-slate-900/30 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-white text-lg">{event.title}</h3>
                                <div className="flex items-center gap-4 text-slate-400 mt-1 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        <span>{new Date(event.date).toLocaleString()}</span>
                                    </div>
                                    {event.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin size={16} />
                                            <span>{event.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button
                                    onClick={() => handleBlast(event.id)}
                                    disabled={blastLoading === event.id}
                                    className="flex items-center space-x-2 bg-blue-900/20 hover:bg-blue-900/40 text-blue-400 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 border border-blue-900/50"
                                >
                                    <Mail size={18} />
                                    <span className="font-medium">
                                        {blastLoading === event.id ? "Sending..." : "Email Subscribers"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    ))}
                    {initialEvents.length === 0 && (
                        <p className="text-slate-500">No events created yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
