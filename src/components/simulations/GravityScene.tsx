"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface GravitySceneProps {
  params: { [key: string]: number };
  scrollProgress: number;
}

export default function GravityScene({ params, scrollProgress }: GravitySceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const gridGeomRef = useRef<THREE.BufferGeometry | null>(null);

  // Sync variables dynamically to THREE refs
  const massRef = useRef(params.mass ?? 1.5);
  const gravityRef = useRef(params.gravity ?? 1.0);
  const speedRef = useRef(params.speed ?? 1.0);

  useEffect(() => {
    massRef.current = params.mass ?? 1.5;
    gravityRef.current = params.gravity ?? 1.0;
    speedRef.current = params.speed ?? 1.0;
  }, [params]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#09090b", 0.015);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 35, 55);
    camera.lookAt(0, -5, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // 2. Add Gravitational Center (Sun/Star)
    const sunGeom = new THREE.SphereGeometry(4, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: "#f59e0b",
      wireframe: true,
    });
    const sunMesh = new THREE.Mesh(sunGeom, sunMat);
    scene.add(sunMesh);

    // Glowing core glow
    const coreGeom = new THREE.SphereGeometry(3.2, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: "#fff" });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    scene.add(coreMesh);

    // 3. Spacetime Grid Mesh
    const gridSize = 80;
    const gridDivs = 40;
    const gridGeom = new THREE.PlaneGeometry(gridSize, gridSize, gridDivs, gridDivs);
    gridGeom.rotateX(-Math.PI / 2); // Rotate to horizontal plane
    gridGeomRef.current = gridGeom;

    const gridMat = new THREE.MeshBasicMaterial({
      color: "#3b82f6",
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const gridMesh = new THREE.Mesh(gridGeom, gridMat);
    gridMesh.position.y = -6;
    scene.add(gridMesh);

    // Keep backup of initial flat grid coordinates
    const initialPositions = gridGeom.attributes.position.clone();

    // 4. Orbiting planet particles
    const orbitRadius = 20;
    const planetGeom = new THREE.SphereGeometry(1.2, 16, 16);
    const planetMat = new THREE.MeshBasicMaterial({ color: "#06b6d4", wireframe: true });
    const planetMesh = new THREE.Mesh(planetGeom, planetMat);
    scene.add(planetMesh);

    // Trail particles
    const trailCount = 100;
    const trailGeom = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(trailCount * 3);
    trailGeom.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
    const trailMat = new THREE.PointsMaterial({
      size: 0.4,
      color: "#06b6d4",
      transparent: true,
      opacity: 0.6,
    });
    const trailPoints = new THREE.Points(trailGeom, trailMat);
    scene.add(trailPoints);
    const trailHistory: THREE.Vector3[] = [];

    // Ambient Lighting
    const pointLight = new THREE.PointLight("#f59e0b", 4, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Dynamic state
    let angle = 0;
    let animId: number;

    const tick = () => {
      animId = requestAnimationFrame(tick);

      // 1. Calculate Orbit Physics via Kepler parameters
      const speedCoeff = speedRef.current * 0.025;
      const forceScale = gravityRef.current * massRef.current;
      angle += speedCoeff * Math.sqrt(forceScale);

      const px = Math.cos(angle) * orbitRadius;
      const pz = Math.sin(angle) * orbitRadius;
      const py = -Math.sin(angle * 2) * 2; // subtle orbital tilt
      
      planetMesh.position.set(px, py, pz);

      // 2. Orbit Trail History Updates
      trailHistory.push(new THREE.Vector3(px, py, pz));
      if (trailHistory.length > trailCount) {
        trailHistory.shift();
      }

      const trailArr = trailGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < trailCount; i++) {
        const p = trailHistory[i] || new THREE.Vector3(px, py, pz);
        trailArr[i * 3] = p.x;
        trailArr[i * 3 + 1] = p.y;
        trailArr[i * 3 + 2] = p.z;
      }
      trailGeom.attributes.position.needsUpdate = true;

      // 3. Spacetime Grid Distortion Math (Deform vertices near massive bodies)
      const gridPos = gridGeom.attributes.position;
      const arr = gridPos.array as Float32Array;
      const initArr = initialPositions.array as Float32Array;

      for (let i = 0; i < gridPos.count; i++) {
        const idx = i * 3;
        const vx = initArr[idx];
        const vy = initArr[idx + 1];
        const vz = initArr[idx + 2];

        // Gravitational pull calculations from Sun (center 0,0) and Planet
        const distToSun = Math.sqrt(vx * vx + vz * vz);
        const sunDeformation = - (massRef.current * 8.0) / (distToSun * 0.15 + 1.8);

        const dx = vx - planetMesh.position.x;
        const dz = vz - planetMesh.position.z;
        const distToPlanet = Math.sqrt(dx * dx + dz * dz);
        const planetDeformation = - 1.5 / (distToPlanet * 0.2 + 1.0);

        arr[idx + 1] = vy + sunDeformation + planetDeformation; // Deflect Y downward
      }
      gridPos.needsUpdate = true;

      // 4. Camera Parallax linking scroll indices
      const scrollAngle = scrollProgress * Math.PI * 1.5;
      camera.position.x = Math.sin(scrollAngle) * 55;
      camera.position.z = Math.cos(scrollAngle) * 55;
      camera.lookAt(0, -6, 0);

      // Rotate central star slowly
      sunMesh.rotation.y += 0.005;

      renderer.render(scene, camera);
    };
    tick();

    // Resize
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      sunGeom.dispose();
      sunMat.dispose();
      coreGeom.dispose();
      coreMat.dispose();
      gridGeom.dispose();
      gridMat.dispose();
      planetGeom.dispose();
      planetMat.dispose();
      trailGeom.dispose();
      trailMat.dispose();
      renderer.dispose();
    };
  }, [scrollProgress]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />
    </div>
  );
}
