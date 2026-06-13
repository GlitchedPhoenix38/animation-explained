"use client";

import React, { useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { damping: 25, stiffness: 150, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150, mass: 0.5 });

  const contentRotateX = useTransform(springY, [0, 1], [1.2, -1.2]);
  const contentRotateY = useTransform(springX, [0, 1], [-1.2, 1.2]);

  useEffect(() => {
    if (!containerRef.current || !bgRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        y: 60,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

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
      if (!prefersReducedMotion) {
        mouseX.set(clientX / window.innerWidth);
        mouseY.set(clientY / window.innerHeight);
      }
    };

    window.addEventListener("mousemove", handlePointer, { passive: true });
    window.addEventListener("touchmove", handlePointer, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handlePointer);
      window.removeEventListener("touchmove", handlePointer);
    };
  }, [mouseX, mouseY, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#09090b] flex flex-col justify-between p-6 md:p-12 select-none"
    >
      <h1 className="sr-only">Interactive Visual Explainers</h1>

      {/* Background layer — subtle atmospheric gradient with scroll parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none will-change-transform"
        aria-hidden="true"
      >
        <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[600px] md:w-[900px] h-[600px] md:h-[900px] rounded-full bg-gradient-to-b from-cyan-500/[0.04] to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] md:w-[700px] h-[400px] md:h-[700px] rounded-full bg-gradient-to-t from-blue-500/[0.03] to-transparent blur-3xl" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-neutral-500/[0.02] to-transparent blur-3xl" />
      </div>

      {/* Header — midground layer */}
      <header className="relative z-10 w-full flex justify-between items-center bg-[#09090b]/40 border border-white/5 backdrop-blur-md px-6 py-3 rounded-full max-w-5xl mx-auto shadow-lg shadow-black/20">
        <a href="/" className="font-semibold text-base tracking-tight text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded px-2" aria-label="Home">
          AXIOM
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-400 font-medium">
          <a href="/explainers/gravity" className="hover:text-white transition-colors duration-200">Gravity</a>
          <a href="/explainers/networking" className="hover:text-white transition-colors duration-200">Networking</a>
          <a href="/explainers/ml" className="hover:text-white transition-colors duration-200">Neural Nets</a>
        </nav>
        <a
          href="/explainers/gravity"
          className="px-5 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          Open
        </a>
      </header>

      {/* Content — foreground layer with cursor perspective */}
      <motion.div
        style={
          !prefersReducedMotion
            ? {
                rotateX: contentRotateX,
                rotateY: contentRotateY,
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }
            : undefined
        }
        className="relative z-10 max-w-4xl mx-auto w-full my-auto"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start"
        >
          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-[0.95] tracking-tighter text-left mb-6 max-w-4xl"
          >
            Learn through interactive simulations
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-neutral-400 text-sm md:text-base max-w-lg font-light leading-relaxed mb-10"
          >
            Explore physics, algorithms, and networking through interactive 3D simulations. Adjust parameters and see how things change in real time.
          </motion.p>

          <motion.div variants={itemVariants} className="flex gap-4">
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
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-2">
        <div className="flex flex-col items-center gap-2 text-[10px] text-neutral-500 font-mono tracking-widest">
          <span>Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-neutral-500 to-transparent" />
        </div>
      </div>
    </div>
  );
}
