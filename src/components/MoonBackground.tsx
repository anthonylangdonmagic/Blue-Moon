"use client";

import { motion } from "framer-motion";

export function MoonBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {/* Deep Midnight Blue Background */}
      <div className="absolute inset-0 bg-[#020617]" />

      {/* The Moon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full bg-gradient-to-br from-blue-100 via-blue-400 to-blue-900 opacity-20 blur-3xl"
      />

      {/* Secondary Glow */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-900/20 blur-[100px]" />

      {/* Stars (Optional subtle texture) */}
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      
      {/* Glass Overlay for depth */}
      <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[1px]" />
    </div>
  );
}
