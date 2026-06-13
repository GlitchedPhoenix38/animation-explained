"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface NetworkingSceneProps {
  params: { [key: string]: number };
  scrollProgress: number;
}

interface Node {
  mesh: THREE.Mesh;
  id: number;
  label: string;
}

export default function NetworkingScene({ params, scrollProgress }: NetworkingSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadRef = useRef(params.load ?? 3.0);
  const speedRef = useRef(params.speed ?? 1.0);

  useEffect(() => {
    loadRef.current = params.load ?? 3.0;
    speedRef.current = params.speed ?? 1.0;
  }, [params]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#09090b", 0.01);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 25, 60);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Define Network Nodes
    const nodeCoords = [
      { x: -30, y: 0, z: 0, label: "Client" },
      { x: -10, y: 15, z: -10, label: "Router A" },
      { x: -10, y: -15, z: 10, label: "Router B" },
      { x: 10, y: 15, z: 10, label: "Router C" },
      { x: 10, y: -15, z: -10, label: "Router D" },
      { x: 30, y: 0, z: 0, label: "Database Server" },
    ];

    const nodes: Node[] = [];
    const nodeGeom = new THREE.SphereGeometry(2.5, 16, 16);

    nodeCoords.forEach((coord, idx) => {
      // Glow wireframe mesh
      const mat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? "#06b6d4" : idx === 5 ? "#22c55e" : "#3b82f6",
        wireframe: true,
      });
      const mesh = new THREE.Mesh(nodeGeom, mat);
      mesh.position.set(coord.x, coord.y, coord.z);
      scene.add(mesh);
      nodes.push({ mesh, id: idx, label: coord.label });
    });

    // 3. Define Connections (Paths)
    const links = [
      [0, 1], [0, 2], // Client connections
      [1, 3], [1, 4], [2, 3], [2, 4], // Router connections
      [3, 5], [4, 5], // Server connections
    ];

    const lines: THREE.Line[] = [];
    links.forEach(([from, to]) => {
      const fromNode = nodes[from].mesh.position;
      const toNode = nodes[to].mesh.position;

      const pathGeom = new THREE.BufferGeometry().setFromPoints([fromNode, toNode]);
      const pathMat = new THREE.LineBasicMaterial({
        color: "#1e293b",
        transparent: true,
        opacity: 0.4,
      });
      const line = new THREE.Line(pathGeom, pathMat);
      scene.add(line);
      lines.push(line);
    });

    // 4. Packet Particles Engine
    const packetCount = 200;
    const packetGeom = new THREE.BufferGeometry();
    const packetPositions = new Float32Array(packetCount * 3);
    const packetProgress = new Float32Array(packetCount);
    const packetPathIndices = new Int32Array(packetCount);

    for (let i = 0; i < packetCount; i++) {
      packetProgress[i] = Math.random();
      packetPathIndices[i] = Math.floor(Math.random() * links.length);
    }

    packetGeom.setAttribute("position", new THREE.BufferAttribute(packetPositions, 3));
    const packetMat = new THREE.PointsMaterial({
      size: 0.8,
      color: "#06b6d4",
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const packetSystem = new THREE.Points(packetGeom, packetMat);
    scene.add(packetSystem);

    // Dynamic State
    let animId: number;

    const tick = () => {
      animId = requestAnimationFrame(tick);

      const speed = speedRef.current * 0.004;
      const arr = packetGeom.attributes.position.array as Float32Array;

      // Animate active packets along links
      for (let i = 0; i < packetCount; i++) {
        // Increment progress
        packetProgress[i] += speed;
        if (packetProgress[i] > 1.0) {
          packetProgress[i] = 0;
          packetPathIndices[i] = Math.floor(Math.random() * links.length);
        }

        const linkIdx = packetPathIndices[i];
        const [from, to] = links[linkIdx];
        
        const fromPos = nodes[from].mesh.position;
        const toPos = nodes[to].mesh.position;
        const t = packetProgress[i];

        // Linear interpolation
        arr[i * 3] = fromPos.x + (toPos.x - fromPos.x) * t;
        arr[i * 3 + 1] = fromPos.y + (toPos.y - fromPos.y) * t;
        arr[i * 3 + 2] = fromPos.z + (toPos.z - fromPos.z) * t;
      }
      packetGeom.attributes.position.needsUpdate = true;

      // Rotate nodes slightly for dynamic depth
      nodes.forEach((n) => {
        n.mesh.rotation.y += 0.01;
        n.mesh.rotation.x += 0.005;
      });

      // Camera sweeps based on scroll index
      const targetY = 25 - scrollProgress * 45;
      const targetZ = 60 - scrollProgress * 20;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.position.z += (targetZ - camera.position.z) * 0.05;
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
      nodeGeom.dispose();
      packetGeom.dispose();
      packetMat.dispose();
      renderer.dispose();
    };
  }, [scrollProgress]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />
    </div>
  );
}
