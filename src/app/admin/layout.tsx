import Link from "next/link";
import { LayoutDashboard, PenTool, User, MessageSquare, Calendar } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-950">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 p-6 hidden md:block">
                <div className="mb-8">
                    <h1 className="text-xl font-bold text-white">Blue Moon Admin</h1>
                </div>
                <nav className="space-y-2">
                    <Link href="/admin" className="flex items-center space-x-3 text-slate-400 hover:text-white hover:bg-slate-900 px-4 py-3 rounded-lg transition-colors">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/admin/write" className="flex items-center space-x-3 text-slate-400 hover:text-white hover:bg-slate-900 px-4 py-3 rounded-lg transition-colors">
                        <PenTool size={20} />
                        <span>Write</span>
                    </Link>
                    <Link href="/admin/about" className="flex items-center space-x-3 text-slate-400 hover:text-white hover:bg-slate-900 px-4 py-3 rounded-lg transition-colors">
                        <User size={20} />
                        <span>Edit About</span>
                    </Link>
                    <Link href="/admin/inbox" className="flex items-center space-x-3 text-slate-400 hover:text-white hover:bg-slate-900 px-4 py-3 rounded-lg transition-colors">
                        <MessageSquare size={20} />
                        <span>Inbox</span>
                    </Link>
                    <Link href="/admin/events" className="flex items-center space-x-3 text-slate-400 hover:text-white hover:bg-slate-900 px-4 py-3 rounded-lg transition-colors">
                        <Calendar size={20} />
                        <span>Events & Blast</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
