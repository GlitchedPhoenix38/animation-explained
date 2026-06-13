"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface MLSceneProps {
  params: { [key: string]: number };
  scrollProgress: number;
}

interface Neuron {
  mesh: THREE.Mesh;
  layer: number;
  idx: number;
}

export default function MLScene({ params, scrollProgress }: MLSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const speedRef = useRef(params.speed ?? 1.0);
  const epochsRef = useRef(params.epochs ?? 10.0);

  useEffect(() => {
    speedRef.current = params.speed ?? 1.0;
    epochsRef.current = params.epochs ?? 10.0;
  }, [params]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#09090b", 0.012);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 55);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Build Layers (Input: 3, Hidden: 4, Output: 2)
    const layerSizes = [3, 4, 2];
    const neurons: Neuron[] = [];
    const neuronGeom = new THREE.SphereGeometry(1.6, 16, 16);

    const layerSpacing = 22;
    const nodeSpacing = 10;

    layerSizes.forEach((size, lIdx) => {
      const x = (lIdx - (layerSizes.length - 1) / 2) * layerSpacing;
      
      for (let nIdx = 0; nIdx < size; nIdx++) {
        const y = (nIdx - (size - 1) / 2) * nodeSpacing;
        
        const mat = new THREE.MeshBasicMaterial({
          color: lIdx === 0 ? "#ec4899" : lIdx === 1 ? "#3b82f6" : "#22c55e",
          wireframe: true,
        });
        const mesh = new THREE.Mesh(neuronGeom, mat);
        mesh.position.set(x, y, 0);
        scene.add(mesh);
        
        neurons.push({ mesh, layer: lIdx, idx: nIdx });
      }
    });

    // 3. Define Synapse Weights
    const synapses: { from: Neuron; to: Neuron; line: THREE.Line; weight: number }[] = [];

    neurons.forEach((fromN) => {
      neurons.forEach((toN) => {
        if (toN.layer === fromN.layer + 1) {
          const fromPos = fromN.mesh.position;
          const toPos = toN.mesh.position;

          const lineGeom = new THREE.BufferGeometry().setFromPoints([fromPos, toPos]);
          const weight = Math.random(); // Initial random weight
          const lineMat = new THREE.LineBasicMaterial({
            color: "#e2e8f0",
            transparent: true,
            opacity: 0.1 + weight * 0.4,
          });
          const line = new THREE.Line(lineGeom, lineMat);
          scene.add(line);

          synapses.push({ from: fromN, to: toN, line, weight });
        }
      });
    });

    // 4. Signal Wave Particles (Feedforward flow)
    const signalCount = 80;
    const signalGeom = new THREE.BufferGeometry();
    const signalPositions = new Float32Array(signalCount * 3);
    const signalProgress = new Float32Array(signalCount);
    const signalSynapseIndices = new Int32Array(signalCount);

    for (let i = 0; i < signalCount; i++) {
      signalProgress[i] = Math.random();
      signalSynapseIndices[i] = Math.floor(Math.random() * synapses.length);
    }

    signalGeom.setAttribute("position", new THREE.BufferAttribute(signalPositions, 3));
    const signalMat = new THREE.PointsMaterial({
      size: 0.8,
      color: "#ec4899", // Magenta/pink signal pulse
      transparent: true,
      opacity: 0.9,
    });
    const signalSystem = new THREE.Points(signalGeom, signalMat);
    scene.add(signalSystem);

    // Dynamic State
    let animId: number;

    const tick = () => {
      animId = requestAnimationFrame(tick);

      const speed = speedRef.current * 0.005;
      const arr = signalGeom.attributes.position.array as Float32Array;

      // Animate signals forward
      for (let i = 0; i < signalCount; i++) {
        signalProgress[i] += speed;
        if (signalProgress[i] > 1.0) {
          signalProgress[i] = 0;
          signalSynapseIndices[i] = Math.floor(Math.random() * synapses.length);
        }

        const synIdx = signalSynapseIndices[i];
        const { from, to, weight } = synapses[synIdx];

        const fromPos = from.mesh.position;
        const toPos = to.mesh.position;
        const t = signalProgress[i];

        arr[i * 3] = fromPos.x + (toPos.x - fromPos.x) * t;
        arr[i * 3 + 1] = fromPos.y + (toPos.y - fromPos.y) * t;
        arr[i * 3 + 2] = fromPos.z + (toPos.z - fromPos.z) * t;

        // Change colors dynamic base on learning weights
        const activeColor = new THREE.Color();
        activeColor.lerpColors(new THREE.Color("#ec4899"), new THREE.Color("#22c55e"), weight);
        signalMat.color = activeColor;
      }
      signalGeom.attributes.position.needsUpdate = true;

      // Light up paths on scroll progress
      synapses.forEach(({ line, weight }) => {
        const lineMat = line.material as THREE.LineBasicMaterial;
        lineMat.opacity = 0.05 + weight * 0.4 + scrollProgress * 0.45;
      });

      // Slowly rotate camera based on scroll index
      const cameraAngle = (scrollProgress - 0.5) * 0.6;
      camera.position.x = Math.sin(cameraAngle) * 55;
      camera.position.z = Math.cos(cameraAngle) * 55;
      camera.lookAt(0, 0, 0);

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
      neuronGeom.dispose();
      signalGeom.dispose();
      signalMat.dispose();
      renderer.dispose();
    };
  }, [scrollProgress]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />
    </div>
  );
}
