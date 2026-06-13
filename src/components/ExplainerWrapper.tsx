"use client";

import React, { useEffect, useRef, useState } from "react";
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

  return (
    <div ref={containerRef} className="relative w-full min-h-[300vh] bg-[#09090b] text-white">
      <div className="fixed top-0 right-0 w-full md:w-1/2 h-screen z-0 bg-[#0c0c0e]/50 border-l border-white/5">
        {renderActiveScene()}
      </div>

      <header className="fixed top-6 left-6 right-6 md:right-auto md:w-[calc(50%-48px)] z-20 flex justify-between items-center bg-[#09090b]/40 border border-white/5 backdrop-blur-md px-6 py-3 rounded-full shadow-lg">
        <a href="/" className="font-semibold text-sm tracking-wide text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded px-2">
          {concept.title}
        </a>
        <a
          href="/"
          className="px-4 py-1.5 rounded-full text-xs font-semibold bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-700"
        >
          Back
        </a>
      </header>

      <div className="relative z-10 w-full md:w-1/2 min-h-full flex flex-col justify-start px-6 md:px-16 py-32 md:py-48 gap-48 pointer-events-none">
        {concept.scrollSteps.map((step, idx) => (
          <section
            key={idx}
            className="w-full min-h-[60vh] flex flex-col justify-center items-start gap-4 select-none"
          >
            <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
              Step {idx + 1}
            </span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-2">
              {step.description}
            </h2>
            <p className="text-neutral-400 text-sm md:text-base font-light leading-relaxed max-w-lg">
              Scroll to move through the explanation, or adjust the controls to explore on your own.
            </p>
          </section>
        ))}
      </div>

      <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[calc(50%-48px)] z-20 bg-[#09090b]/75 border border-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-2xl flex flex-col gap-4 pointer-events-auto">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <h3 className="text-sm font-semibold tracking-wider text-white uppercase font-mono">Controls</h3>
          {concept.presets.length > 0 && (
            <div className="flex gap-2">
              {concept.presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => loadPreset(preset.values)}
                  className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition focus:outline-none"
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
              <div className="flex justify-between text-xs font-mono text-neutral-400">
                <span>{p.name}</span>
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
                className="w-full h-1 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-cyan-500"
                aria-label={`Adjust ${p.name}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
