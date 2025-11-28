"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    description: string;
    is_private: boolean;
}

export function EventItem({ event }: { event: Event }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6 mb-6 hover:border-purple-500/30 transition-colors"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                        <div className="flex items-center space-x-1">
                            <Calendar size={16} />
                            <span>{new Date(event.date).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <MapPin size={16} />
                            <span>{event.location}</span>
                        </div>
                    </div>

                    {/* Add to Calendar Buttons */}
                    <div className="flex space-x-3">
                        <button
                            onClick={() => {
                                const startTime = new Date(event.date).toISOString().replace(/-|:|\.\d\d\d/g, "");
                                const endTime = new Date(new Date(event.date).getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, ""); // Default 1 hour
                                const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
                                window.open(url, '_blank');
                            }}
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded border border-slate-700 transition-colors"
                        >
                            + Google Cal
                        </button>
                        <button
                            onClick={() => {
                                const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${new Date(event.date).toISOString().replace(/-|:|\.\d\d\d/g, "")}
DTEND:${new Date(new Date(event.date).getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "")}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
                                const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                                const link = document.createElement('a');
                                link.href = window.URL.createObjectURL(blob);
                                link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded border border-slate-700 transition-colors"
                        >
                            + Apple Cal
                        </button>
                    </div>
                </div>
                {event.is_private && (
                    <span className="px-3 py-1 text-xs font-medium text-purple-200 bg-purple-900/30 rounded-full border border-purple-800">
                        Private
                    </span>
                )}
            </div>

            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {event.description}
            </div>
        </motion.article>
    );
}
