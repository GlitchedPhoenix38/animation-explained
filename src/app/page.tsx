"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import ScrollReveal from "@/components/ScrollReveal";
import { EXPLAINER_CONCEPTS } from "@/data/explainers";

const descriptions: Record<string, string> = {
  physics: "Adjust mass, gravity, and orbital speed to see how objects move through spacetime.",
  networking: "Control traffic load and packet speed to watch data route through the network.",
  ml: "Tune training speed and epochs to observe how signals flow through neural connections.",
  sorting: "Change array size and swap frequency to follow each comparison and reorder.",
  databases: "Adjust table schemas and query intensity to see relational joins in action.",
};

const badgeColors: Record<string, string> = {
  physics: "text-amber-400/80",
  networking: "text-cyan-400/80",
  ml: "text-pink-400/80",
  sorting: "text-violet-400/80",
  databases: "text-green-400/80",
};

export default function Home() {
  const cards = Object.values(EXPLAINER_CONCEPTS);

  return (
    <div className="w-full min-h-screen bg-[#09090b] text-white overflow-x-hidden">
      <Hero />

      <section id="concepts" className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-40">
        <div className="flex flex-col items-start gap-4 mb-20 md:mb-28">
          <ScrollReveal variant="scaleIn">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-[1.05]">
              Interactive explainers
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeSlideUp" delay={0.15}>
            <p className="text-neutral-400 text-sm md:text-base max-w-md font-light leading-relaxed">
              Each topic includes a live visualization you can control. Adjust parameters and observe the effect in real time.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {cards.map((card, idx) => (
            <Link
              key={card.id}
              href={`/explainers/${card.id}`}
              className="focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group cursor-pointer relative overflow-hidden bg-[#0c0c0e] border border-white/[0.06] rounded-2xl p-8 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/40 hover:border-white/[0.12]"
              >
                <div className="flex flex-col gap-6 justify-between h-48 relative z-10">
                  <div className="flex justify-between items-start">
                    <span className={`text-[11px] font-mono tracking-widest uppercase ${badgeColors[card.category]}`}>
                      {card.category}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-600">0{idx + 1}</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-white mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-neutral-400 font-light leading-relaxed">
                      {descriptions[card.category]}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-500 group-hover:text-neutral-300 transition-colors duration-300">
                    Explore
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/[0.04] py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-2 text-xs text-neutral-600">
          <span>Interactive visual explainers</span>
          <span className="text-neutral-700">© 2026</span>
        </div>
      </footer>
    </div>
  );
}
