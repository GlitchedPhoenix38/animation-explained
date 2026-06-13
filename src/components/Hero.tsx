"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#09090b] flex flex-col justify-between p-6 md:p-12 select-none">
      <h1 className="sr-only">Interactive Visual Explainers</h1>

      <header className="relative z-10 w-full flex justify-between items-center bg-[#09090b]/40 border border-white/5 backdrop-blur-md px-6 py-3 rounded-full max-w-5xl mx-auto shadow-lg shadow-black/20">
        <a href="/" className="font-semibold text-base tracking-wide text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded px-2" aria-label="Home">
          AXIOM
        </a>
        <nav className="hidden md:flex items-center gap-8 text-xs text-neutral-400 font-medium">
          <a href="#gravity" className="hover:text-white transition-colors duration-200 focus:outline-none focus:text-white">Gravity</a>
          <a href="#networking" className="hover:text-white transition-colors duration-200 focus:outline-none focus:text-white">Networking</a>
          <a href="#ml" className="hover:text-white transition-colors duration-200 focus:outline-none focus:text-white">Neural Nets</a>
        </nav>
        <a
          href="/explainers/gravity"
          className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          Open
        </a>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto w-full my-auto flex flex-col items-start focus:outline-none" tabIndex={-1}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-none tracking-tighter text-left mb-6">
            Learn through interactive simulations
          </h2>
        </motion.div>

        <p className="text-neutral-400 text-sm md:text-base max-w-lg font-light text-left leading-relaxed mb-8">
          Explore physics, algorithms, and networking through interactive 3D simulations. Adjust parameters and see how things change in real time.
        </p>

        <div className="flex gap-4">
          <a
            href="/explainers/gravity"
            className="px-6 py-3 rounded-full text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            Explore topics
          </a>
          <a
            href="#concepts"
            className="px-6 py-3 rounded-full text-xs font-semibold bg-neutral-900 text-neutral-300 border border-neutral-800 hover:bg-neutral-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neutral-700"
          >
            View all
          </a>
        </div>
      </main>

      <footer className="relative z-10 w-full flex justify-center items-center max-w-5xl mx-auto text-[10px] text-neutral-500 font-mono">
        <div className="flex flex-col items-center gap-2">
          <span className="tracking-widest">Scroll to explore</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-neutral-500 to-transparent" />
        </div>
      </footer>
    </div>
  );
}
