"use client";

import React, { useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Programmatic generation of a soft radial-gradient particle texture
// This avoids square WebGL points (a common AI-generation signature)
const createParticleTexture = (): THREE.Texture => {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.2, "rgba(6, 182, 212, 0.8)"); // Cyan highlight
  gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.3)"); // Blue glow outer ring
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  
  // Accessibility check for user motion preferences (Apple/Linear Standard)
  const prefersReducedMotion = useReducedMotion();
  
  // High-performance spring values mapping mouse coordinates to DOM offsets
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 180, mass: 0.6 };
  const overlayX = useSpring(mouseX, springConfig);
  const overlayY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // 1. Scene & Render Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#09090b", 0.012); // Obsidian match fog
    
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // 2. Mesh & Particles Allocation
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const initialPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 40 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      // Spherical coordinate distribution to prevent uniform box appearance
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i] = x;
      positions[i + 1] = y;
      positions[i + 2] = z;

      initialPositions[i] = x;
      initialPositions[i + 1] = y;
      initialPositions[i + 2] = z;

      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    
    const particleTexture = createParticleTexture();
    const material = new THREE.PointsMaterial({
      size: 1.2,
      map: particleTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Dynamic light tracking vector
    const light = new THREE.PointLight("#06b6d4", 15, 120, 1.2);
    scene.add(light);

    // 3. Pointer Coordinate Tracking (Mouse + Touch Support for Mobile UX)
    let pointerX = 0;
    let pointerY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ("touches" in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      // Normalized coordinates (-1 to 1)
      pointerX = (clientX / window.innerWidth) * 2 - 1;
      pointerY = -(clientY / window.innerHeight) * 2 + 1;

      // Update interactive overlay position if motion is allowed
      if (!prefersReducedMotion) {
        mouseX.set((clientX - window.innerWidth / 2) * 0.025);
        mouseY.set((clientY - window.innerHeight / 2) * 0.025);
      }
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    // 4. GSAP Scroll Camera Path Parallax (Disabled dynamically for reduced motion)
    let scrollTriggerInstance: ScrollTrigger | null = null;
    if (!prefersReducedMotion) {
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
        onUpdate: (self) => {
          const p = self.progress;
          // Spline camera movement coordinates
          camera.position.z = 50 - p * 30;
          camera.position.y = -p * 35;
          camera.position.x = p * 10;
          camera.lookAt(new THREE.Vector3(0, -p * 15, 0));
        }
      });
    }

    // 5. Physics Simulation Render Frame Tick
    let animId: number;
    const posAttr = geometry.attributes.position;
    const array = posAttr.array as Float32Array;

    const tick = () => {
      animId = requestAnimationFrame(tick);

      // WebGL Particle physics using spring dampening calculations
      for (let i = 0; i < particleCount * 3; i += 3) {
        // Apply normal drift velocities
        array[i] += velocities[i];
        array[i + 1] += velocities[i + 1];
        array[i + 2] += velocities[i + 2];

        // Gravitational pull math
        const targetX = pointerX * 45;
        const targetY = pointerY * 45;
        const dx = targetX - array[i];
        const dy = targetY - array[i + 1];
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 25 && !prefersReducedMotion) {
          const strength = (25 - dist) * 0.003;
          array[i] += dx * strength;
          array[i + 1] += dy * strength;
        } else {
          // Return to initial bounds to preserve distribution structure
          array[i] += (initialPositions[i] - array[i]) * 0.01;
          array[i + 1] += (initialPositions[i + 1] - array[i + 1]) * 0.01;
          array[i + 2] += (initialPositions[i + 2] - array[i + 2]) * 0.01;
        }
      }
      posAttr.needsUpdate = true;

      // Subtle scene rotations
      if (!prefersReducedMotion) {
        particles.rotation.y += (pointerX * 0.08 - particles.rotation.y) * 0.05;
        particles.rotation.x += (-pointerY * 0.08 - particles.rotation.x) * 0.05;
      }

      // Sync lighting position to cursor coordinates
      light.position.x = pointerX * 30;
      light.position.y = pointerY * 30;

      renderer.render(scene, camera);
    };
    tick();

    // 6. Responsive resize adjustments
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Cleanup resources
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, [mouseX, mouseY, prefersReducedMotion]);

  // Premium character-by-character animation variables (Stripe/Linear standard)
  const headlineWords = "Learn Concepts Through Motion".split(" ");

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#09090b] flex flex-col justify-between p-6 md:p-12 select-none"
    >
      {/* Dynamic SEO Semantic Heading (Visually Hidden) */}
      <h1 className="sr-only">AXIOM - Interactive Visual Educational Engine</h1>

      {/* WebGL Stage */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Apple-style floating header bar */}
      <header className="relative z-10 w-full flex justify-between items-center bg-[#09090b]/40 border border-white/5 backdrop-blur-md px-6 py-3 rounded-full max-w-5xl mx-auto shadow-lg shadow-black/20">
        <a href="/" className="font-semibold text-base tracking-wide text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded px-2" aria-label="AXIOM Home">
          AXIOM
        </a>
        <nav className="hidden md:flex items-center gap-8 text-xs text-neutral-400 font-medium">
          <a href="#gravity" className="hover:text-white transition-colors duration-200 focus:outline-none focus:text-white">Gravity</a>
          <a href="#networking" className="hover:text-white transition-colors duration-200 focus:outline-none focus:text-white">Networking</a>
          <a href="#ml" className="hover:text-white transition-colors duration-200 focus:outline-none focus:text-white">AI Neural Nets</a>
        </nav>
        <button 
          className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label="Enter Interactive Sandbox Labs"
        >
          Enter Labs
        </button>
      </header>

      {/* Typography Overlay */}
      <motion.main
        style={{ x: overlayX, y: overlayY }}
        className="relative z-10 max-w-4xl mx-auto w-full my-auto flex flex-col items-start focus:outline-none"
        tabIndex={-1}
      >
        <div className="flex items-center gap-2 mb-4 bg-cyan-950/30 border border-cyan-500/20 rounded-full px-3 py-1 text-cyan-400 text-xs font-mono tracking-widest uppercase">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          Kinaesthetic Learning
        </div>

        {/* Premium split-word slide transitions */}
        <h2 
          ref={headingRef}
          className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-none tracking-tighter text-left mb-6"
        >
          {headlineWords.map((word, wordIdx) => (
            <span key={wordIdx} className="inline-block overflow-hidden mr-3 pb-2">
              <motion.span
                initial={{ translateY: "100%" }}
                animate={{ translateY: "0%" }}
                transition={{
                  duration: prefersReducedMotion ? 0.1 : 0.8,
                  delay: wordIdx * 0.08,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className={`inline-block ${
                  word === "Through" || word === "Motion"
                    ? "font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"
                    : ""
                }`}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h2>

        <p className="text-neutral-400 text-sm md:text-base max-w-lg font-light text-left leading-relaxed mb-8">
          An interactive digital medium detailing theories of physics, sorting algorithms, 
          and neural networks visually. Stop reading abstracts—start observing coordinate systems.
        </p>

        <div className="flex gap-4">
          <button 
            className="px-6 py-3 rounded-full text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Launch active physics simulation"
          >
            Launch Simulation
          </button>
          <button 
            className="px-6 py-3 rounded-full text-xs font-semibold bg-neutral-900 text-neutral-300 border border-neutral-800 hover:bg-neutral-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neutral-700"
            aria-label="Read visual explanation manifesto"
          >
            Read Manifesto
          </button>
        </div>
      </motion.main>

      {/* Screen reader live updates announcer */}
      <div className="sr-only" aria-live="polite">
        AXIOM landing page loaded. Move your cursor to interact with the background particle universe.
      </div>

      {/* Footer bar */}
      <footer className="relative z-10 w-full flex justify-between items-center max-w-5xl mx-auto text-[10px] text-neutral-500 font-mono">
        <div>COORDINATE WELL [X, Y, Z]</div>
        <div className="flex flex-col items-center gap-2">
          <span className="tracking-widest">SCROLL TO OBSERVE</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-neutral-500 to-transparent" />
        </div>
        <div>V1.0.0 (BETA)</div>
      </footer>
    </div>
  );
}
