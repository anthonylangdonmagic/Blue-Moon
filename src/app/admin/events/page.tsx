import { createClient } from "@/lib/supabase-server";
import { EventAdmin } from "../../../components/EventAdmin";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
    const supabase = await createClient();
    const { data: events } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Events & Blast</h1>
            <EventAdmin initialEvents={events || []} />
        </div>
    );
}
