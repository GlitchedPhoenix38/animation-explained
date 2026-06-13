"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import { EXPLAINER_CONCEPTS } from "@/data/explainers";

export default function Home() {
  const cards = Object.values(EXPLAINER_CONCEPTS);

  // Layout color matches for subject directories
  const accentColors = {
    physics: "hover:border-amber-500/40 hover:shadow-amber-500/5",
    networking: "hover:border-cyan-500/40 hover:shadow-cyan-500/5",
    ml: "hover:border-pink-500/40 hover:shadow-pink-500/5",
    sorting: "hover:border-violet-500/40 hover:shadow-violet-500/5",
    databases: "hover:border-green-500/40 hover:shadow-green-500/5",
  };

  const bgGlows = {
    physics: "bg-amber-500/5",
    networking: "bg-cyan-500/5",
    ml: "bg-pink-500/5",
    sorting: "bg-violet-500/5",
    databases: "bg-green-500/5",
  };

  const textColors = {
    physics: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    networking: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
    ml: "text-pink-400 border-pink-500/20 bg-pink-500/5",
    sorting: "text-violet-400 border-violet-500/20 bg-violet-500/5",
    databases: "text-green-400 border-green-500/20 bg-green-500/5",
  };

  return (
    <div className="w-full min-h-screen bg-[#09090b] text-white overflow-x-hidden">
      {/* 3D Interactive Hero Section */}
      <Hero />

      {/* Explainer Categories Directory Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-32 md:py-48 flex flex-col gap-16">
        <div className="flex flex-col items-start gap-4">
          <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">Interactive Directory</span>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white leading-none">
            Observe Fundamental <br />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-500">
              Theories in Action
            </span>
          </h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-md font-light leading-relaxed">
            Click on any module to enter a scroll-driven explanation stage equipped with 
            live mathematical parameter controls.
          </p>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <Link
              key={card.id}
              href={`/explainers/${card.id}`}
              className="focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`group cursor-pointer relative overflow-hidden bg-[#0c0c0e] border border-white/5 rounded-2xl p-8 transition-all duration-500 shadow-xl ${accentColors[card.category]}`}
              >
                {/* Subject Accent Glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${bgGlows[card.category]}`} />

                <div className="flex flex-col gap-6 justify-between h-48 relative z-10">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-mono tracking-widest uppercase border px-2.5 py-0.5 rounded-full ${textColors[card.category]}`}>
                      {card.category}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">0{idx + 1}</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed">
                      Visualize parameters, track vector flows, and experiment with {card.category} models.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-semibold text-neutral-400 group-hover:text-white transition-colors duration-300 font-mono uppercase tracking-widest">
                    Enter Stage
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Manifesto manifesto footer section */}
      <footer className="border-t border-white/5 py-12 px-6 text-center text-xs text-neutral-600 font-mono tracking-wider">
        <div>DESIGNED BY AXIOM CREATIVE LABS</div>
        <div className="mt-2 text-neutral-700">© 2026 AXIOM LABS INC. ALL RIGHTS RESERVED.</div>
      </footer>
    </div>
  );
}
