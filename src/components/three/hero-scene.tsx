"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles, Environment } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

function Knot() {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.18;
    ref.current.rotation.y += delta * 0.22;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.2}>
      <mesh ref={ref} scale={1.6}>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial
          color="#6366f1"
          roughness={0.18}
          metalness={0.45}
          distort={0.35}
          speed={1.4}
          envMapIntensity={1.2}
        />
      </mesh>
    </Float>
  );
}

function Ring({ radius, tilt, color }: { radius: number; tilt: number; color: string }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * 0.08;
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.012, 16, 200]} />
      <meshBasicMaterial color={color} transparent opacity={0.35} />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 45 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} color="#a5b4fc" />
        <pointLight position={[-4, -2, -2]} intensity={1.4} color="#38bdf8" />
        <pointLight position={[3, -3, 2]} intensity={0.9} color="#ec4899" />

        <Knot />

        <Ring radius={2.4} tilt={1.1} color="#818cf8" />
        <Ring radius={2.85} tilt={0.6} color="#38bdf8" />
        <Ring radius={3.3} tilt={1.6} color="#c084fc" />

        <Sparkles count={120} scale={8} size={2.2} speed={0.35} color="#a5b4fc" opacity={0.7} />

        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
