"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

function Octahedron() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.rotation.x += delta * 0.15;
    }
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1.2, 0]} />
      <meshBasicMaterial color="#888" wireframe transparent opacity={0.08} />
    </mesh>
  );
}

export default function DashboardDecoration() {
  return (
    <div className="fixed bottom-8 right-8 w-32 h-32 opacity-30 pointer-events-none z-0">
      <Canvas dpr={1} camera={{ position: [0, 0, 3.5] }}>
        <Octahedron />
      </Canvas>
    </div>
  );
}
