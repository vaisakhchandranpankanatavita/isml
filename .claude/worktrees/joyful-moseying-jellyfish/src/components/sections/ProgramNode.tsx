import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image, Float } from '@react-three/drei';
import * as THREE from 'three';
import type { K12Program as Program } from '@/types';

interface ProgramNodeProps {
  program: Program;
  index: number;
  total: number;
  radius: number;
  isActive: boolean;
  onHover: (index: number) => void;
  onUnhover: () => void;
}

export default function ProgramNode({
  program,
  index,
  total,
  radius,
  isActive,
  onHover,
  onUnhover,
}: ProgramNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Calculate polar coordinates
  const angle = (index / total) * Math.PI * 2;
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Smoothly interpolate scale based on active state
    const targetScale = isActive ? 1.2 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    // Slight floating motion independent of the Float component for tighter control
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime + index) * 0.002;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Image
        ref={meshRef}
        url={program.coverUrl}
        transparent
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(index);
        }}
        onPointerOut={() => onUnhover()}
        onClick={(e) => {
          e.stopPropagation();
          onHover(index);
        }}
        position={[x, 0, z]}
        rotation={[0, -angle, 0]}
        scale={[2, 1.5, 1]}
      />
    </Float>
  );
}