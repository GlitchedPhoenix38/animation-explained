"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface DatabaseSceneProps {
  params: { [key: string]: number };
  scrollProgress: number;
}

export default function DatabaseScene({ params, scrollProgress }: DatabaseSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tablesCountRef = useRef(params.tables ?? 3.0);
  const loadRef = useRef(params.load ?? 1.0);

  useEffect(() => {
    tablesCountRef.current = params.tables ?? 3.0;
    loadRef.current = params.load ?? 1.0;
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
    camera.position.set(0, 15, 55);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const pointLight = new THREE.PointLight("#22c55e", 5, 100); // Green glow
    pointLight.position.set(0, 10, 20);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight("#0f172a", 0.4);
    scene.add(ambientLight);

    // 2. Generate Floating Table Sheets (Glass Panels)
    const tables: THREE.Mesh[] = [];
    const tableWidth = 14;
    const tableHeight = 18;
    const sheetGeom = new THREE.PlaneGeometry(tableWidth, tableHeight);

    const positions = [
      { x: -18, y: 3, z: -5, color: "#ffffff" }, // Users Table
      { x: 0, y: -2, z: 5, color: "#ffffff" },   // Orders Table
      { x: 18, y: 4, z: -5, color: "#888888" },  // Products Table
    ];

    positions.forEach((pos, idx) => {
      const sheetMat = new THREE.MeshBasicMaterial({
        color: pos.color,
        wireframe: true,
        transparent: true,
        opacity: idx === 2 ? 0.08 : 0.15,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(sheetGeom, sheetMat);
      mesh.position.set(pos.x, pos.y, pos.z);
      scene.add(mesh);
      tables.push(mesh);
    });

    // 3. Connective Relation Splines (Foreign key relations)
    const relationships = [
      { from: 0, fromY: 4, to: 1, toY: 0, color: "#ffffff" }, // User ID -> Orders
      { from: 2, fromY: -2, to: 1, toY: -4, color: "#ffffff" }, // Product ID -> Orders
    ];

    const splineLines: THREE.Line[] = [];

    relationships.forEach((rel) => {
      const fromMesh = tables[rel.from];
      const toMesh = tables[rel.to];

      const p1 = new THREE.Vector3(fromMesh.position.x, fromMesh.position.y + rel.fromY, fromMesh.position.z);
      const p4 = new THREE.Vector3(toMesh.position.x, toMesh.position.y + rel.toY, toMesh.position.z);
      
      // Control points to draw curved bezier paths instead of straight lines
      const p2 = new THREE.Vector3((p1.x + p4.x) / 2, p1.y + 4, (p1.z + p4.z) / 2);
      const p3 = new THREE.Vector3((p1.x + p4.x) / 2, p4.y - 4, (p1.z + p4.z) / 2);

      const curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4);
      const points = curve.getPoints(50);

      const curveGeom = new THREE.BufferGeometry().setFromPoints(points);
      const curveMat = new THREE.LineBasicMaterial({
        color: rel.color,
        transparent: true,
        opacity: 0.15,
      });
      const line = new THREE.Line(curveGeom, curveMat);
      scene.add(line);
      splineLines.push(line);
    });

    // 4. Data Query particles (moving along relation lines)
    const queryCount = 20;
    const queryGeom = new THREE.BufferGeometry();
    const queryPositions = new Float32Array(queryCount * 3);
    const queryProgress = new Float32Array(queryCount);
    const queryRelIndices = new Int32Array(queryCount);

    for (let i = 0; i < queryCount; i++) {
      queryProgress[i] = Math.random();
      queryRelIndices[i] = Math.floor(Math.random() * relationships.length);
    }

    queryGeom.setAttribute("position", new THREE.BufferAttribute(queryPositions, 3));
    const queryMat = new THREE.PointsMaterial({
      size: 0.6,
      color: "#ffffff",
      transparent: true,
      opacity: 0.8,
    });
    const querySystem = new THREE.Points(queryGeom, queryMat);
    scene.add(querySystem);

    // Dynamic state
    let animId: number;

    const tick = () => {
      animId = requestAnimationFrame(tick);

      const speed = loadRef.current * 0.005;
      const arr = queryGeom.attributes.position.array as Float32Array;

      // Animate query particles along bezier splines
      for (let i = 0; i < queryCount; i++) {
        queryProgress[i] += speed;
        if (queryProgress[i] > 1.0) {
          queryProgress[i] = 0;
          queryRelIndices[i] = Math.floor(Math.random() * relationships.length);
        }

        const relIdx = queryRelIndices[i];
        const rel = relationships[relIdx];
        
        const fromMesh = tables[rel.from];
        const toMesh = tables[rel.to];
        const p1 = new THREE.Vector3(fromMesh.position.x, fromMesh.position.y + rel.fromY, fromMesh.position.z);
        const p4 = new THREE.Vector3(toMesh.position.x, toMesh.position.y + rel.toY, toMesh.position.z);
        const p2 = new THREE.Vector3((p1.x + p4.x) / 2, p1.y + 4, (p1.z + p4.z) / 2);
        const p3 = new THREE.Vector3((p1.x + p4.x) / 2, p4.y - 4, (p1.z + p4.z) / 2);

        const curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4);
        const t = queryProgress[i];
        const pos = curve.getPointAt(t);

        arr[i * 3] = pos.x;
        arr[i * 3 + 1] = pos.y;
        arr[i * 3 + 2] = pos.z;
      }
      queryGeom.attributes.position.needsUpdate = true;

      // Card floats based on time triggers
      const time = Date.now() * 0.0015;
      tables.forEach((mesh, index) => {
        mesh.position.y = positions[index].y + Math.sin(time + index * 1.5) * 1.5;
        // Subtle tilt
        mesh.rotation.y = Math.sin(time * 0.5 + index) * 0.1;
      });

      // Camera parallax scroll rotation
      const angle = (scrollProgress - 0.5) * 0.8;
      camera.position.x = Math.sin(angle) * 55;
      camera.position.z = Math.cos(angle) * 55;
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
      sheetGeom.dispose();
      queryGeom.dispose();
      queryMat.dispose();
      renderer.dispose();
    };
  }, [scrollProgress, params]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />
    </div>
  );
}
