import { cookies } from "next/headers";
import { EventGate } from "@/components/EventGate";
import { EventsList } from "@/components/EventsList";

export default async function EventsPage() {
    const cookieStore = await cookies();
    const hasAccess = cookieStore.get("event_access")?.value === "true";

    if (!hasAccess) {
        return <EventGate />;
    }

    return <EventsList />;
}
