"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform, useReducedMotion, useScroll } from "framer-motion";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Mouse tracking for perspective tilt
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springX = useSpring(mouseX, { damping: 40, stiffness: 100, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 40, stiffness: 100, mass: 0.5 });

  // Scroll tracking for parallax layers
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const smoothScroll = useSpring(scrollYProgress, { damping: 50, stiffness: 90 });

  // Parallax transformations
  const bgY = useTransform(smoothScroll, [0, 1], ["0px", "160px"]);
  const bgScale = useTransform(smoothScroll, [0, 1], [1, 1.05]);
  const midY = useTransform(smoothScroll, [0, 1], ["0px", "-80px"]);
  const foreY = useTransform(smoothScroll, [0, 1], ["0px", "-20px"]);
  const foreOpacity = useTransform(smoothScroll, [0, 0.7], [1, 0]);

  // Perspective transformations for background grid
  const gridRotateX = useTransform(springY, [0, 1], [10, -10]);
  const gridRotateY = useTransform(springX, [0, 1], [-10, 10]);

  // Live coordinate state for UI detail
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointer = (e: MouseEvent | TouchEvent) => {
      let clientX: number;
      let clientY: number;
      if ("touches" in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      
      const relativeX = clientX / window.innerWidth;
      const relativeY = clientY / window.innerHeight;

      if (!prefersReducedMotion) {
        mouseX.set(relativeX);
        mouseY.set(relativeY);
      }
      
      setCoords({
        x: Math.round(relativeX * 100),
        y: Math.round(relativeY * 100)
      });
    };

    window.addEventListener("mousemove", handlePointer, { passive: true });
    window.addEventListener("touchmove", handlePointer, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handlePointer);
      window.removeEventListener("touchmove", handlePointer);
    };
  }, [mouseX, mouseY, prefersReducedMotion]);

  // Animations variants
  const maskTextVariants = {
    hidden: { y: "100%" },
    visible: (customDelay: number) => ({
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const, delay: customDelay }
    })
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (customDelay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] as const, delay: customDelay }
    })
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#09090b] flex flex-col justify-between p-6 md:p-10 select-none"
      style={{ perspective: "1200px" }}
    >
      <h1 className="sr-only">Interactive Visual Explainers</h1>

      {/* Background Layer — Blueprint Grid with Parallax and Perspective Tilt */}
      <motion.div
        style={{
          y: prefersReducedMotion ? 0 : bgY,
          scale: prefersReducedMotion ? 1 : bgScale,
          rotateX: prefersReducedMotion ? 0 : gridRotateX,
          rotateY: prefersReducedMotion ? 0 : gridRotateY,
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center will-change-transform"
      >
        <div 
          className="w-[120%] h-[120%] opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #fafafa 1px, transparent 1px),
              linear-gradient(to bottom, #fafafa 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
            backgroundPosition: "center center",
          }}
        />

        {/* Structural crosshairs & markings */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
          <div className="w-[80vw] h-px bg-white" />
          <div className="h-[80vh] w-px bg-white" />
        </div>
      </motion.div>

      {/* Midground Layer — Large Outlined Architectural Typography */}
      <motion.div
        style={{
          y: prefersReducedMotion ? 0 : midY,
          opacity: prefersReducedMotion ? 0.03 : useTransform(smoothScroll, [0, 0.8], [0.03, 0]),
        }}
        className="absolute inset-0 pointer-events-none z-5 flex items-center justify-center overflow-hidden will-change-transform"
      >
        <span 
          className="text-[12vw] font-bold tracking-tighter text-transparent select-none"
          style={{
            WebkitTextStroke: "1px rgba(250, 250, 250, 0.4)",
            fontFamily: "var(--font-geist-sans), sans-serif",
          }}
        >
          SYSTEMS
        </span>
      </motion.div>

      {/* Blueprint Corner Metadata Details */}
      <div className="absolute top-6 left-6 text-[9px] font-mono text-neutral-600 tracking-wider pointer-events-none z-10 hidden sm:block">
        [SYS_REF: 0x7F] [SCALE: 1:1]
      </div>
      <div className="absolute top-6 right-6 text-[9px] font-mono text-neutral-600 tracking-wider pointer-events-none z-10 hidden sm:block">
        [COORD: {coords.x}X, {coords.y}Y]
      </div>
      <div className="absolute bottom-6 left-6 text-[9px] font-mono text-neutral-600 tracking-wider pointer-events-none z-10 hidden sm:block">
        PROJECT: EXPLAINERS // 2026
      </div>

      {/* Header — floating minimalist topbar */}
      <header className="relative z-20 w-full max-w-6xl mx-auto flex justify-between items-center border border-white/5 bg-black/40 backdrop-blur-md px-8 py-3.5 rounded-none shadow-lg">
        <a 
          href="/" 
          className="font-medium text-sm tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-neutral-500 px-1 font-mono uppercase" 
          aria-label="Home"
        >
          AXIOM //
        </a>
        <nav className="hidden md:flex items-center gap-10 text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
          <a href="/explainers/gravity" className="hover:text-white transition-colors duration-200">01 / Gravity</a>
          <a href="/explainers/networking" className="hover:text-white transition-colors duration-200">02 / Networking</a>
          <a href="/explainers/ml" className="hover:text-white transition-colors duration-200">03 / Neural Nets</a>
        </nav>
        <a
          href="#concepts"
          className="px-5 py-2 text-[10px] font-mono tracking-widest uppercase bg-white text-black hover:bg-neutral-200 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-white/40"
        >
          Browse Index
        </a>
      </header>

      {/* Content — Foreground Layer */}
      <motion.div
        style={{
          y: prefersReducedMotion ? 0 : foreY,
          opacity: prefersReducedMotion ? 1 : foreOpacity,
        }}
        className="relative z-10 max-w-5xl mx-auto w-full my-auto flex flex-col items-start px-6 md:px-12 will-change-transform"
      >
        {/* Decorative category label */}
        <motion.div 
          variants={fadeUpVariants}
          custom={0}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-2 mb-4 text-[10px] font-mono tracking-widest uppercase text-neutral-500"
        >
          <span className="w-1.5 h-1.5 bg-neutral-600 rounded-full" />
          SYSTEMICS & SIMULATION
        </motion.div>

        <div className="flex flex-col gap-1.5 mb-8">
          <div className="overflow-hidden">
            <motion.h2
              variants={maskTextVariants}
              custom={0.15}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white leading-[1.0] tracking-tighter"
            >
              Interactive Systems,
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              variants={maskTextVariants}
              custom={0.3}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-neutral-400 leading-[1.0] tracking-tighter"
            >
              Explained through Motion.
            </motion.h2>
          </div>
        </div>

        <motion.p
          variants={fadeUpVariants}
          custom={0.55}
          initial="hidden"
          animate="visible"
          className="text-neutral-400 text-sm md:text-base max-w-lg font-light leading-relaxed mb-10"
        >
          An exploration of orbital gravity, network routing, neural networks, sorting algorithms, and relational databases. Adjust variables, observe behavior, and dissect mechanics in real time.
        </motion.p>

        <motion.div 
          variants={fadeUpVariants} 
          custom={0.7}
          initial="hidden"
          animate="visible"
          className="flex gap-4"
        >
          <a
            href="/explainers/gravity"
            className="px-6 py-3.5 text-[10px] font-mono tracking-widest uppercase bg-white text-black hover:bg-neutral-200 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-white/40"
          >
            Launch System
          </a>
          <a
            href="#concepts"
            className="px-6 py-3.5 text-[10px] font-mono tracking-widest uppercase bg-neutral-900 text-neutral-300 border border-neutral-800 hover:bg-neutral-800 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-neutral-700"
          >
            Read Index
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        style={{
          opacity: prefersReducedMotion ? 0.6 : foreOpacity,
        }}
        className="relative z-10 flex justify-center pb-2 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-3 text-[9px] font-mono text-neutral-500 tracking-widest uppercase">
          <span>Scroll to decode</span>
          <div className="w-px h-10 bg-gradient-to-b from-neutral-600 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}
