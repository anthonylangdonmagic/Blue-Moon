import { createClient } from "@/lib/supabase-server";
import { AboutForm } from "@/components/AboutForm";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
    const supabase = await createClient();
    const { data } = await supabase
        .from("about_page")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Edit About Page</h1>
            <AboutForm
                initialBio={data?.bio || ""}
                initialImage={data?.image_url || ""}
            />
        </div>
    );
}
