"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { IExplainerConcept } from "@/types/explainer";
import GravityScene from "./simulations/GravityScene";
import NetworkingScene from "./simulations/NetworkingScene";
import MLScene from "./simulations/MLScene";
import SortingScene from "./simulations/SortingScene";
import DatabaseScene from "./simulations/DatabaseScene";

interface ExplainerWrapperProps {
  concept: IExplainerConcept;
}

export default function ExplainerWrapper({ concept }: ExplainerWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [paramValues, setParamValues] = useState<{ [key: string]: number }>(() => {
    const initial: { [key: string]: number } = {};
    concept.parameters.forEach((p) => {
      initial[p.id] = p.defaultValue;
    });
    return initial;
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      const scrolled = -rect.top;
      const maxScroll = elementHeight - windowHeight;
      const progress = Math.max(0, Math.min(1, scrolled / maxScroll));

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleParamChange = (id: string, val: number) => {
    setParamValues((prev) => ({ ...prev, [id]: val }));
  };

  const loadPreset = (values: { [key: string]: number }) => {
    setParamValues((prev) => ({ ...prev, ...values }));
  };

  const renderActiveScene = () => {
    switch (concept.category) {
      case "physics":
        return <GravityScene params={paramValues} scrollProgress={scrollProgress} />;
      case "networking":
        return <NetworkingScene params={paramValues} scrollProgress={scrollProgress} />;
      case "ml":
        return <MLScene params={paramValues} scrollProgress={scrollProgress} />;
      case "sorting":
        return <SortingScene params={paramValues} scrollProgress={scrollProgress} />;
      case "databases":
        return <DatabaseScene params={paramValues} scrollProgress={scrollProgress} />;
      default:
        return null;
    }
  };

  // Determine active step index based on current scroll progress ratio
  const getActiveStepIdx = () => {
    if (scrollProgress < 0.35) return 0;
    if (scrollProgress < 0.7) return 1;
    return 2;
  };
  const activeIdx = getActiveStepIdx();

  // Scroll tracking specifically for the timeline line fill
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const smoothTimelineProgress = useSpring(scrollYProgress, { damping: 40, stiffness: 100 });

  return (
    <div ref={containerRef} className="relative w-full min-h-[300vh] bg-[#09090b] text-white">
      {/* Background blueprint visualizer grid (continues visual language) */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #fafafa 1px, transparent 1px),
            linear-gradient(to bottom, #fafafa 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          backgroundPosition: "center center",
        }}
      />

      {/* Visualizer Scene Panel (Takes 50% width on desktop) */}
      <div className="fixed top-0 right-0 w-full md:w-1/2 h-screen z-0 bg-[#0c0c0e] border-l border-white/5">
        {renderActiveScene()}
      </div>

      {/* Minimal technical header */}
      <header className="fixed top-6 left-6 right-6 md:right-auto md:w-[calc(50%-48px)] z-20 flex justify-between items-center border border-white/5 bg-black/60 backdrop-blur-md px-6 py-3.5 rounded-none shadow-lg">
        <a 
          href="/" 
          className="font-medium text-xs tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-neutral-500 px-1 font-mono uppercase"
        >
          AXIOM // {concept.title}
        </a>
        <a
          href="/"
          className="px-4 py-1.5 text-[9px] font-mono tracking-widest uppercase bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-neutral-700"
        >
          [CLOSE]
        </a>
      </header>

      {/* Left side text container */}
      <div className="relative z-10 w-full md:w-1/2 min-h-full flex flex-col justify-start pl-6 pr-6 md:pl-20 md:pr-16 py-32 md:py-48 gap-48 pointer-events-none">
        
        {/* Timeline Line indicator */}
        <div className="absolute left-6 md:left-10 top-40 bottom-40 w-px bg-white/5 pointer-events-none hidden sm:block">
          <motion.div
            style={{ scaleY: smoothTimelineProgress, originY: 0 }}
            className="w-full h-full bg-neutral-400 origin-top"
          />
        </div>

        {concept.scrollSteps.map((step, idx) => {
          const isActive = idx === activeIdx;

          return (
            <section
              key={idx}
              className={`relative w-full min-h-[60vh] flex flex-col justify-center items-start gap-4 select-none transition-all duration-700 ${
                isActive ? "opacity-100 translate-x-0" : "opacity-15 -translate-x-2"
              }`}
            >
              {/* Timeline status indicator dot */}
              <div 
                className={`absolute -left-6 md:-left-10.5 w-2 h-2 rounded-full border bg-[#09090b] -translate-x-[3.5px] ${
                  isActive ? "border-white bg-white scale-110" : "border-white/10"
                } transition-all duration-500 pointer-events-none hidden sm:block`}
                style={{ top: "calc(50% - 4px)" }}
              />

              <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                PHASE 0{idx + 1}
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-white mb-2 leading-[1.15] max-w-md">
                {step.description}
              </h2>
              <p className="text-neutral-500 text-xs md:text-sm font-light leading-relaxed max-w-sm">
                Focus on the active visualization to the right. Adjust the constants panel below to review dynamic feedback responses.
              </p>
            </section>
          );
        })}
      </div>

      {/* Property Inspector HUD Panel (Floating properties sidebar look) */}
      <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[360px] z-20 bg-black/85 border border-white/5 backdrop-blur-xl p-5 rounded-none shadow-2xl flex flex-col gap-4 pointer-events-auto">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h3 className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Properties HUD</h3>
          {concept.presets.length > 0 && (
            <div className="flex gap-1.5">
              {concept.presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => loadPreset(preset.values)}
                  className="px-2.5 py-1 text-[8px] font-mono tracking-wider bg-neutral-900 border border-white/5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all duration-200 focus:outline-none"
                  title={preset.description}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {concept.parameters.map((p) => (
            <div key={p.id} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                <span>{p.name.toUpperCase()}</span>
                <span className="text-white">
                  {paramValues[p.id]?.toFixed(p.step < 1 ? 2 : 0)}
                  {p.unit}
                </span>
              </div>
              <input
                type="range"
                min={p.min}
                max={p.max}
                step={p.step}
                value={paramValues[p.id] ?? p.defaultValue}
                onChange={(e) => handleParamChange(p.id, parseFloat(e.target.value))}
                className="w-full h-1 bg-neutral-800 rounded-none appearance-none cursor-pointer accent-white"
                aria-label={`Adjust ${p.name}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
