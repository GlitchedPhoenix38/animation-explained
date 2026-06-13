"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import Hero from "@/components/Hero";
import { EXPLAINER_CONCEPTS } from "@/data/explainers";

const descriptions: Record<string, string> = {
  physics: "Observe how mass distorts the fabric of spacetime. Interact with Keplerian orbits, adjust planetary mass, and see how gravity shapes the path of celestial bodies.",
  networking: "Trace the path of data packets through routing nodes. Simulate network congestion, change transit speeds, and observe how routing algorithms dynamically prevent packet loss.",
  ml: "Look inside a feedforward neural network. Adjust training rates and observe how weight optimization and backpropagation shape the neural connections.",
  sorting: "Observe the mechanics of sorting algorithms in real time. Follow the array values as they are compared, swapped, and aligned into absolute order.",
  databases: "Visualize relational databases in action. Trace how foreign keys anchor connections and watch query signals join tables across spline channels.",
};

function ConceptCard({ card }: { card: any }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const renderSvg = (id: string) => {
    switch (id) {
      case "gravity":
        return (
          <svg viewBox="0 0 100 100" className="w-32 h-32 stroke-neutral-700 stroke-[0.75] fill-none">
            <circle cx="50" cy="50" r="5" className="stroke-white fill-white/10" />
            <ellipse cx="50" cy="50" rx="30" ry="10" className="stroke-neutral-800" transform="rotate(-15 50 50)" />
            <ellipse cx="50" cy="50" rx="42" ry="15" className="stroke-neutral-800" transform="rotate(20 50 50)" />
            <circle cx="23" cy="42" r="1.5" className="fill-neutral-400 stroke-none" />
          </svg>
        );
      case "networking":
        return (
          <svg viewBox="0 0 100 100" className="w-32 h-32 stroke-neutral-700 stroke-[0.75] fill-none">
            <line x1="20" y1="50" x2="50" y2="25" />
            <line x1="20" y1="50" x2="50" y2="75" />
            <line x1="50" y1="25" x2="80" y2="50" />
            <line x1="50" y1="75" x2="80" y2="50" />
            <line x1="50" y1="25" x2="50" y2="75" />
            <circle cx="20" cy="50" r="3.5" className="stroke-neutral-500 fill-[#09090b]" />
            <circle cx="50" cy="25" r="3.5" className="stroke-neutral-500 fill-[#09090b]" />
            <circle cx="50" cy="75" r="3.5" className="stroke-neutral-500 fill-[#09090b]" />
            <circle cx="80" cy="50" r="3.5" className="stroke-white fill-[#09090b]" />
          </svg>
        );
      case "ml":
        return (
          <svg viewBox="0 0 100 100" className="w-32 h-32 stroke-neutral-700 stroke-[0.75] fill-none">
            <line x1="25" y1="30" x2="50" y2="20" />
            <line x1="25" y1="30" x2="50" y2="50" />
            <line x1="25" y1="30" x2="50" y2="80" />
            <line x1="25" y1="70" x2="50" y2="20" />
            <line x1="25" y1="70" x2="50" y2="50" />
            <line x1="25" y1="70" x2="50" y2="80" />
            <line x1="50" y1="20" x2="75" y2="35" />
            <line x1="50" y1="50" x2="75" y2="35" />
            <line x1="50" y1="80" x2="75" y2="65" />
            <circle cx="25" cy="30" r="3" className="stroke-neutral-500 fill-[#09090b]" />
            <circle cx="25" cy="70" r="3" className="stroke-neutral-500 fill-[#09090b]" />
            <circle cx="50" cy="20" r="3" className="stroke-neutral-500 fill-[#09090b]" />
            <circle cx="50" cy="50" r="3" className="stroke-neutral-500 fill-[#09090b]" />
            <circle cx="50" cy="80" r="3" className="stroke-neutral-500 fill-[#09090b]" />
            <circle cx="75" cy="35" r="3" className="stroke-white fill-[#09090b]" />
            <circle cx="75" cy="65" r="3" className="stroke-white fill-[#09090b]" />
          </svg>
        );
      case "sorting":
        return (
          <svg viewBox="0 0 100 100" className="w-32 h-32 stroke-neutral-700 stroke-[0.75] fill-none">
            <rect x="15" y="55" width="8" height="25" className="stroke-neutral-700 fill-none" />
            <rect x="28" y="40" width="8" height="40" className="stroke-neutral-600 fill-none" />
            <rect x="41" y="25" width="8" height="55" className="stroke-neutral-500 fill-none" />
            <rect x="54" y="48" width="8" height="32" className="stroke-neutral-600 fill-none" />
            <rect x="67" y="15" width="8" height="65" className="stroke-white fill-none" />
            <rect x="80" y="35" width="8" height="45" className="stroke-neutral-500 fill-none" />
          </svg>
        );
      case "databases":
        return (
          <svg viewBox="0 0 100 100" className="w-32 h-32 stroke-neutral-700 stroke-[0.75] fill-none">
            <rect x="15" y="20" width="22" height="30" className="stroke-neutral-500 fill-[#09090b]" />
            <rect x="63" y="20" width="22" height="30" className="stroke-neutral-500 fill-[#09090b]" />
            <rect x="39" y="55" width="22" height="25" className="stroke-white fill-[#09090b]" />
            <path d="M 26,35 C 26,50 50,45 50,55" className="stroke-neutral-600 stroke-dasharray-[2,2]" />
            <path d="M 74,35 C 74,50 50,45 50,55" className="stroke-neutral-600 stroke-dasharray-[2,2]" />
          </svg>
        );
      default:
        return null;
    }
  };

  const xLabel = useTransform(x, v => Math.round(v));
  const yLabel = useTransform(y, v => Math.round(v));

  return (
    <Link href={`/explainers/${card.id}`} className="focus:outline-none block w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="group relative w-full aspect-[4/3] bg-[#0c0c0e] border border-white/5 flex items-center justify-center overflow-hidden cursor-pointer hover:border-white/10 transition-colors duration-300"
      >
        {/* Hover technical crosshair */}
        {hovering && (
          <div className="absolute inset-0 pointer-events-none z-10">
            <motion.div style={{ y }} className="absolute left-0 right-0 h-px bg-white/[0.08]" />
            <motion.div style={{ x }} className="absolute top-0 bottom-0 w-px bg-white/[0.08]" />
            <motion.div 
              style={{ x, y }} 
              className="absolute -mt-6 -ml-12 text-[8px] font-mono text-neutral-500 bg-[#09090b]/90 border border-white/5 px-1.5 py-0.5 rounded shadow-lg backdrop-blur-sm"
            >
              LOC: [<motion.span>{xLabel}</motion.span>, <motion.span>{yLabel}</motion.span>]
            </motion.div>
          </div>
        )}

        {/* Content Preview */}
        <div className="relative z-5 flex flex-col items-center justify-center p-8 transition-transform duration-500 group-hover:scale-105">
          {renderSvg(card.id)}
        </div>

        {/* Decorative blueprint coordinates at corners */}
        <div className="absolute top-3 left-3 text-[7px] font-mono text-neutral-700 tracking-widest">[CRD_A:00]</div>
        <div className="absolute top-3 right-3 text-[7px] font-mono text-neutral-700 tracking-widest">[CRD_B:10]</div>
        <div className="absolute bottom-3 left-3 text-[7px] font-mono text-neutral-700 tracking-widest">[CRD_C:01]</div>
        <div className="absolute bottom-3 right-3 text-[7px] font-mono text-neutral-700 tracking-widest">[CRD_D:11]</div>
      </motion.div>
    </Link>
  );
}

export default function Home() {
  const cards = Object.values(EXPLAINER_CONCEPTS);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll tracking across the concepts container to animate the timeline progress line
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"]
  });

  return (
    <div className="w-full min-h-screen bg-[#09090b] text-white overflow-x-hidden">
      <Hero />

      {/* Narrative Concepts Section */}
      <section 
        id="concepts" 
        ref={sectionRef} 
        className="relative z-10 max-w-5xl mx-auto px-6 py-40 md:py-60 flex flex-col items-center"
      >
        {/* Editorial Section Header */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-40 md:mb-56 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start gap-2"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">
              EXPLORATORY INDEX //
            </span>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-[1.05]">
              Interactive Modules
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <p className="text-neutral-400 text-sm md:text-base max-w-md font-light leading-relaxed">
              Dismantle systems to inspect their operations. Each module functions as an isolated simulator where you govern the constants to observe output responses dynamically.
            </p>
          </motion.div>
        </div>

        {/* Timeline Central Vertical Line */}
        <div className="absolute left-[50%] top-64 bottom-20 w-px bg-white/10 -translate-x-[50%] pointer-events-none hidden md:block">
          <motion.div
            style={{ scaleY: scrollYProgress, originY: 0 }}
            className="w-full h-full bg-neutral-500 origin-top"
          />
        </div>

        {/* Timeline Chapters */}
        <div className="flex flex-col gap-32 md:gap-48 w-full relative">
          {cards.map((card, idx) => {
            const isLeft = idx % 2 === 0;

            return (
              <div 
                key={card.id} 
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 w-full items-center"
              >
                {/* Timeline node marker for desktop */}
                <div className="absolute left-[50%] -translate-x-[50%] w-2 h-2 rounded-full bg-neutral-800 border border-white/25 hidden md:block" />

                {/* Asymmetric Alternating Layout */}
                {isLeft ? (
                  <>
                    {/* Left Column: Concept Card */}
                    <div className="md:col-span-6 order-2 md:order-1">
                      <ConceptCard card={card} />
                    </div>

                    {/* Right Column: Chapter Info */}
                    <div className="md:col-span-5 md:col-start-8 order-1 md:order-2 flex flex-col items-start gap-4">
                      <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                        <span>CHAPTER 0{idx + 1}</span>
                        <span>//</span>
                        <span className="text-neutral-400">{card.category}</span>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-light tracking-tight text-white">
                        {card.title}
                      </h3>
                      
                      <p className="text-sm text-neutral-400 font-light leading-relaxed max-w-md">
                        {descriptions[card.category]}
                      </p>

                      <Link 
                        href={`/explainers/${card.id}`}
                        className="group flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-white hover:text-neutral-400 transition-colors mt-2"
                      >
                        Launch Simulator
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Left Column: Chapter Info */}
                    <div className="md:col-span-5 md:col-start-1 order-1 md:order-1 flex flex-col items-start md:items-end gap-4 text-left md:text-right">
                      <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                        <span>CHAPTER 0{idx + 1}</span>
                        <span>//</span>
                        <span className="text-neutral-400">{card.category}</span>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-light tracking-tight text-white">
                        {card.title}
                      </h3>
                      
                      <p className="text-sm text-neutral-400 font-light leading-relaxed max-w-md md:ml-auto">
                        {descriptions[card.category]}
                      </p>

                      <Link 
                        href={`/explainers/${card.id}`}
                        className="group flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-white hover:text-neutral-400 transition-colors mt-2"
                      >
                        <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1 hidden md:inline-block">←</span>
                        Launch Simulator
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 md:hidden">→</span>
                      </Link>
                    </div>

                    {/* Right Column: Concept Card */}
                    <div className="md:col-span-6 md:col-start-7 order-2 md:order-2">
                      <ConceptCard card={card} />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Minimal technical footer */}
      <footer className="border-t border-white/5 py-12 px-6 bg-black/20">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
          <span>EXPLAINERS // VISUAL EXPLANATORY ENGINE</span>
          <span className="text-neutral-700">© 2026 AXIOM LABS. ALL RIGHTS RESERVED.</span>
        </div>
      </footer>
    </div>
  );
}
