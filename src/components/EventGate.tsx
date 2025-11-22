"use client";

import { verifyEventPassword } from "@/app/actions";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export function EventGate() {
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        const result = await verifyEventPassword(formData);
        if (!result.success) {
            setError(result.error || "Invalid password");
        } else {
            // Reload to reflect cookie change
            window.location.reload();
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl"
            >
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="text-blue-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Restricted Access</h2>
                <p className="text-slate-400 mb-6">
                    Enter the secret password to view upcoming events.
                </p>

                <form action={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                    />
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                    >
                        Unlock
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
