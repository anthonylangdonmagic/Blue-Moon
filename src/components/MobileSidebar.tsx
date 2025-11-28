"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, PenTool, User, MessageSquare, Calendar, Menu, X } from "lucide-react";

export function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Hamburger Button (FAB) */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed bottom-6 right-6 z-[100] p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
                aria-label="Open Admin Menu"
            >
                <Menu size={24} />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Drawer */}
            <div className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-950 border-r border-slate-800 p-6 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-xl font-bold text-white">Blue Moon</h1>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-slate-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="space-y-2">
                    <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 text-slate-400 hover:text-white hover:bg-slate-900 px-4 py-3 rounded-lg transition-colors"
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        href="/admin/editor"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 text-slate-400 hover:text-white hover:bg-slate-900 px-4 py-3 rounded-lg transition-colors"
                    >
                        <PenTool size={20} />
                        <span>Create New</span>
                    </Link>
                    <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 text-slate-400 hover:text-white hover:bg-slate-900 px-4 py-3 rounded-lg transition-colors"
                    >
                        <User size={20} />
                        <span>Back to Site</span>
                    </Link>
                </nav>
            </div>
        </>
    );
}
