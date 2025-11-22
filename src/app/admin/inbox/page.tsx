import { createClient } from "@/lib/supabase-server";
import { InboxList } from "../../../components/InboxList";

export const dynamic = "force-dynamic";

export default async function AdminInboxPage() {
    const supabase = await createClient();
    const { data: comments } = await supabase
        .from("comments")
        .select("*, posts(title)")
        .eq("deleted", false)
        .order("created_at", { ascending: false });

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Inbox</h1>
            <InboxList initialComments={comments || []} />
        </div>
    );
}
