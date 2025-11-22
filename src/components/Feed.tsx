import { createClient } from "@/lib/supabase-server";
import { FeedItem } from "./FeedItem";

export async function Feed() {
    const supabase = await createClient();
    const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .order("published_at", { ascending: false });

    if (error) {
        console.error("Error fetching posts:", error);
        return (
            <div className="text-center py-20 text-red-400">
                <p>Failed to load the feed.</p>
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="text-center py-20 text-slate-500">
                <p>The moon is quiet tonight.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {posts.map((post) => (
                // @ts-ignore
                <FeedItem key={post.id} post={post} />
            ))}
        </div>
    );
}
