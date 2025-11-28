import Link from "next/link";
import { Home, Settings, LogIn } from "lucide-react";
import { verifySession } from "@/lib/auth";

export async function Navbar() {
    const session = await verifySession();
    const isAdmin = !!session;
    const user = session; // Simple mapping for now

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
            <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-blue-400 hover:opacity-80 transition-opacity">
                    Blue Moon
                </Link>

                <div className="flex items-center gap-6">
                    <a
                        href="/"
                        className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <Home size={18} />
                        <span className="hidden sm:inline">Home</span>
                    </a>

                    {isAdmin && (
                        <Link
                            href="/admin"
                            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <Settings size={18} />
                            <span className="hidden sm:inline">Admin</span>
                        </Link>
                    )}

                    {!user && (
                        <Link
                            href="/login"
                            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <LogIn size={18} />
                            <span className="hidden sm:inline">Login</span>
                        </Link>
                    )}

                    {user && (
                        <form action={async () => {
                            "use server";
                            const { signOut } = await import("@/app/actions");
                            await signOut();
                        }}>
                            <button
                                type="submit"
                                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                            >
                                <LogIn size={18} className="rotate-180" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </nav>
    );
}
