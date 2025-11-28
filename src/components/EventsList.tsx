import { getDatabase } from "@/lib/db";
import { Calendar, MapPin } from "lucide-react";
import { SubscribeForm } from "./SubscribeForm";

export async function EventsList() {
    const db = await getDatabase();
    const events = db.events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Upcoming Events</h1>
                <p className="text-slate-400">Join us under the moonlight.</p>
            </div>

            {/* Subscription Form */}
            <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-6 mb-12 text-center relative">
                <h3 className="text-lg font-semibold text-blue-100 mb-2">Get Notified</h3>
                <p className="text-sm text-blue-200/70 mb-4">
                    Receive email blasts when new events are announced.
                </p>
                <SubscribeForm />
            </div>

            {/* Events Grid */}
            <div className="grid gap-6">
                {events && events.length > 0 ? (
                    events.map((event) => (
                        <div
                            key={event.id}
                            className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-all group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                        {event.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-slate-400 mt-2 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={16} />
                                            <span>
                                                {new Date(event.date).toLocaleDateString(undefined, {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>
                                        {event.location && (
                                            <div className="flex items-center gap-1">
                                                <MapPin size={16} />
                                                <span>{event.location}</span>
                                            </div>
                                        )}
                                    </div>
                                    {event.description && (
                                        <p className="text-slate-300 mt-4 leading-relaxed">
                                            {event.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex-shrink-0">
                                    <span className="inline-block px-4 py-2 rounded-full bg-slate-800 text-slate-300 text-sm font-medium">
                                        {new Date(event.date) > new Date() ? "Upcoming" : "Past"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800/50">
                        <p>No upcoming events scheduled.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
