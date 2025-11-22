import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const supabase = await createClient();

    const { count: postCount } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true });

    const { count: subscriberCount } = await supabase
        .from("subscribers")
        .select("*", { count: "exact", head: true });

    const { count: commentCount } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("deleted", false);

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <h3 className="text-slate-400 text-sm font-medium mb-2">Total Posts</h3>
                    <p className="text-3xl font-bold text-white">{postCount || 0}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <h3 className="text-slate-400 text-sm font-medium mb-2">Subscribers</h3>
                    <p className="text-3xl font-bold text-white">{subscriberCount || 0}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <h3 className="text-slate-400 text-sm font-medium mb-2">Active Comments</h3>
                    <p className="text-3xl font-bold text-white">{commentCount || 0}</p>
                </div>
            </div>
            <div className="mt-12 bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
                <p className="text-slate-400">Select an option from the sidebar to manage content.</p>
            </div>
        </div>
    );
}
