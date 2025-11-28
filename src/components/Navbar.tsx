import Link from "next/link";
import { Home, Settings, LogIn, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import { verifySession } from "@/lib/auth";
import { getDatabase } from "@/lib/db";

export async function Navbar() {
    const session = await verifySession();
    let userAvatar = null;
    let userRole = null;

    if (session) {
        const db = await getDatabase();
        const user = db.users?.find(u => u.id === session.userId);
        userAvatar = user?.avatar_url;
        userRole = user?.role;
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-blue-400 hover:opacity-80 transition-opacity">
                    Blue Moon
                </Link>

                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium mr-2"
                    >
                        <Home size={18} />
                        <span className="hidden sm:inline">Home</span>
                    </Link>

                    {session ? (
                        <div className="flex items-center gap-4">
                            {userRole === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                                >
                                    <LayoutDashboard size={18} />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Link>
                            )}

                            {/* User Menu Dropdown (Simple CSS Hover for now, or just links) */}
                            <div className="relative group">
                                <button className="w-9 h-9 rounded-full overflow-hidden border border-slate-700 hover:border-blue-500 transition-colors focus:outline-none">
                                    {userAvatar ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400">
                                            <UserIcon size={16} />
                                        </div>
                                    )}
                                </button>

                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right">
                                    <div className="py-1">
                                        <div className="px-4 py-2 border-b border-slate-800">
                                            <p className="text-xs text-slate-500 truncate">{session.email}</p>
                                        </div>
                                        <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                                            <Settings size={16} />
                                            Settings
                                        </Link>
                                        <form action={async () => {
                                            "use server";
                                            const { deleteSession } = await import("@/lib/auth");
                                            await deleteSession();
                                        }}>
                                            <button type="submit" className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 text-left">
                                                <LogOut size={16} />
                                                Sign Out
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="text-slate-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
