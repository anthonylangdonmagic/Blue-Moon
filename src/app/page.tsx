import { Feed } from "@/components/Feed";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="relative z-10 space-y-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/20 mx-auto shadow-[0_0_40px_-10px_rgba(56,189,248,0.5)]">
            {/* Placeholder for user avatar */}
            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
              <span className="text-4xl">🌑</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-blue-200 drop-shadow-lg">
              Blue Moon
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-md mx-auto">
              Thoughts, stories, and moments from the midnight hour.
            </p>
          </div>
        </div>
      </section>

      {/* Feed Section */}
      <section className="pb-20">
        <Feed />
      </section>
    </div>
  );
}
