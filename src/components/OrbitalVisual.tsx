"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function LivingObject() {
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (core.current) {
      core.current.rotation.y += delta * 0.16;
      core.current.rotation.x += delta * 0.08;
      core.current.position.x = THREE.MathUtils.damp(core.current.position.x, state.pointer.x * 0.42, 2.4, delta);
      core.current.position.y = THREE.MathUtils.damp(core.current.position.y, state.pointer.y * 0.3, 2.4, delta);
    }
    if (halo.current) {
      halo.current.rotation.z += delta * 0.08;
      halo.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.16;
    }
  });

  return (
    <group ref={halo}>
      <Float speed={1.15} rotationIntensity={0.28} floatIntensity={0.34}>
        <mesh ref={core}>
          <icosahedronGeometry args={[1.42, 6]} />
          <MeshDistortMaterial color="#78d8c5" roughness={0.19} metalness={0.72} distort={0.42} speed={1.8} />
        </mesh>
      </Float>
      <mesh rotation={[0.8, 0.2, -0.42]}>
        <torusGeometry args={[2.05, 0.009, 12, 180]} />
        <meshBasicMaterial color="#b6f2df" transparent opacity={0.42} />
      </mesh>
      <mesh rotation={[-0.6, 0.7, 0.65]}>
        <torusGeometry args={[2.34, 0.006, 8, 180]} />
        <meshBasicMaterial color="#83b9d1" transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

export default function OrbitalVisual() {
  return (
    <div className="orbital-visual" aria-label="Interactive 3D abstract object">
      <div className="orbital-visual-glow" />
      <Canvas camera={{ position: [0, 0, 6.5], fov: 38 }} dpr={[1, 1.6]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.9} />
        <pointLight position={[4, 4, 5]} intensity={34} color="#c9fff0" />
        <pointLight position={[-4, -2, 2]} intensity={18} color="#5c9cb8" />
        <LivingObject />
        <Sparkles count={72} scale={6.8} size={1.5} speed={0.22} color="#c4f7e6" opacity={0.65} />
      </Canvas>
      <span className="orbital-caption">LIVE FIELD / 001</span>
    </div>
  );
}
