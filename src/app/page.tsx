"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import { EXPLAINER_CONCEPTS } from "@/data/explainers";

const descriptions: Record<string, string> = {
  physics: "Adjust mass, gravity, and orbital speed to see how objects move through spacetime.",
  networking: "Control traffic load and packet speed to watch data route through the network.",
  ml: "Tune training speed and epochs to observe how signals flow through neural connections.",
  sorting: "Change array size and swap frequency to follow each comparison and reorder.",
  databases: "Adjust table schemas and query intensity to see relational joins in action.",
};

export default function Home() {
  const cards = Object.values(EXPLAINER_CONCEPTS);

  const borderAccents: Record<string, string> = {
    physics: "hover:border-amber-500/40",
    networking: "hover:border-cyan-500/40",
    ml: "hover:border-pink-500/40",
    sorting: "hover:border-violet-500/40",
    databases: "hover:border-green-500/40",
  };

  const badgeColors: Record<string, string> = {
    physics: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    networking: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
    ml: "text-pink-400 border-pink-500/20 bg-pink-500/5",
    sorting: "text-violet-400 border-violet-500/20 bg-violet-500/5",
    databases: "text-green-400 border-green-500/20 bg-green-500/5",
  };

  return (
    <div className="w-full min-h-screen bg-[#09090b] text-white overflow-x-hidden">
      <Hero />

      <section id="concepts" className="relative z-10 max-w-6xl mx-auto px-6 py-32 md:py-48 flex flex-col gap-16">
        <div className="flex flex-col items-start gap-4">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white leading-none">
            Interactive explainers
          </h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-md font-light leading-relaxed">
            Each topic includes a live visualization you can control. Adjust parameters and observe the effect in real time.
          </p>
        </div>

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
                className={`group cursor-pointer relative overflow-hidden bg-[#0c0c0e] border border-white/5 rounded-2xl p-8 transition-all duration-500 ${borderAccents[card.category]}`}
              >
                <div className="flex flex-col gap-6 justify-between h-48 relative z-10">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-mono tracking-widest uppercase border px-2.5 py-0.5 rounded-full ${badgeColors[card.category]}`}>
                      {card.category}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">0{idx + 1}</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-white mb-2">
                      {card.title}
                    </h3>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed">
                      {descriptions[card.category]}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-semibold text-neutral-400 font-mono uppercase tracking-widest">
                    Explore
                    <span className="inline-block">→</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/5 py-12 px-6 text-center text-xs text-neutral-600 font-mono tracking-wider">
        <div>Interactive visual explainers</div>
        <div className="mt-2 text-neutral-700">© 2026</div>
      </footer>
    </div>
  );
}
