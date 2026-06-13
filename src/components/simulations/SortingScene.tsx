"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface SortingSceneProps {
  params: { [key: string]: number };
  scrollProgress: number;
}

export default function SortingScene({ params, scrollProgress }: SortingSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elementsRef = useRef<number[]>([]);
  const meshGroupRef = useRef<THREE.Group | null>(null);

  const sizeRef = useRef(params.size ?? 20.0);
  const speedRef = useRef(params.speed ?? 1.0);

  // Re-generate array when size changes
  useEffect(() => {
    sizeRef.current = params.size ?? 20.0;
    speedRef.current = params.speed ?? 1.0;
    
    const count = Math.floor(sizeRef.current);
    const arr: number[] = [];
    for (let i = 1; i <= count; i++) {
      arr.push(i);
    }
    // Shuffle array values
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    elementsRef.current = arr;
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
    camera.position.set(0, 12, 45);
    camera.lookAt(0, 4, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Ambient Lighting
    const pointLight = new THREE.PointLight("#8b5cf6", 4, 100); // Violet glow
    pointLight.position.set(0, 20, 10);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight("#0f172a", 0.5);
    scene.add(ambientLight);

    // 2. Generate 3D Column Meshes
    const group = new THREE.Group();
    scene.add(group);
    meshGroupRef.current = group;

    const arr = elementsRef.current;
    const count = arr.length;
    const colWidth = 1.2;
    const spacing = 1.8;
    const startX = -((count - 1) * spacing) / 2;

    const columns: THREE.Mesh[] = [];
    const colGeom = new THREE.BoxGeometry(colWidth, 1, colWidth);

    arr.forEach((val, idx) => {
      const colMat = new THREE.MeshBasicMaterial({
        color: "#888888",
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      const mesh = new THREE.Mesh(colGeom, colMat);
      mesh.scale.y = val * 1.5; // Scale height proportional to array value
      mesh.position.set(startX + idx * spacing, mesh.scale.y / 2, 0);
      group.add(mesh);
      columns.push(mesh);
    });

    // Dynamic state
    let animId: number;
    let stepTimer = 0;
    let currentIdx = 0;

    const tick = () => {
      animId = requestAnimationFrame(tick);

      stepTimer += speedRef.current;
      
      // Reset all columns to inactive state
      columns.forEach((col) => {
        const mat = col.material as THREE.MeshBasicMaterial;
        mat.color.set("#888888");
        mat.opacity = 0.25;
      });
      
      // Perform simple sorting steps in rendering tick
      if (stepTimer > 20 && count > 1) {
        stepTimer = 0;
        
        // Simple bubble sort step
        let swapped = false;
        for (let j = 0; j < count - 1 - currentIdx; j++) {
          const val1 = arr[j];
          const val2 = arr[j + 1];

          // Highlight the columns being compared
          const mat1 = columns[j].material as THREE.MeshBasicMaterial;
          const mat2 = columns[j + 1].material as THREE.MeshBasicMaterial;
          mat1.color.set("#ffffff");
          mat1.opacity = 0.9;
          mat2.color.set("#ffffff");
          mat2.opacity = 0.9;

          if (val1 > val2) {
            // Swap array values
            arr[j] = val2;
            arr[j + 1] = val1;
            swapped = true;

            // Swap visual heights dynamically
            const tempScale = columns[j].scale.y;
            columns[j].scale.y = columns[j + 1].scale.y;
            columns[j + 1].scale.y = tempScale;

            columns[j].position.y = columns[j].scale.y / 2;
            columns[j + 1].position.y = columns[j + 1].scale.y / 2;
            break;
          }
        }
        
        currentIdx++;
        if (currentIdx >= count - 1 || !swapped) {
          currentIdx = 0; // Reset sorting sweep
        }
      }

      // Camera parallax scroll rotation
      const angle = (scrollProgress - 0.5) * 0.8;
      camera.position.x = Math.sin(angle) * 45;
      camera.position.z = Math.cos(angle) * 45;
      camera.lookAt(0, 6, 0);

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
      colGeom.dispose();
      columns.forEach((col) => {
        (col.material as THREE.MeshBasicMaterial).dispose();
      });
      renderer.dispose();
    };
  }, [scrollProgress, params]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />
    </div>
  );
}
