import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Program } from '@/types';
import ProgramNode from './ProgramNode';

interface CarouselSceneProps {
  programs: Program[];
  activeProgramIndex: number | null;
  setActiveProgramIndex: (index: number | null) => void;
}

export default function CarouselScene({
  programs,
  activeProgramIndex,
  setActiveProgramIndex,
}: CarouselSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Adjust radius based on screen size
  const radius = Math.min(viewport.width / 2, 5);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Constant slow rotation
    groupRef.current.rotation.y += 0.002;

    // Subtle parallax tilt based on mouse position
    const targetX = (state.mouse.x * Math.PI) / 10;
    const targetY = (state.mouse.y * Math.PI) / 10;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -targetX, 0.05);
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[0, 5, 0]} angle={0.3} penumbra={1} intensity={2} castShadow />

      <group ref={groupRef}>
        {programs.map((program, i) => (
          <ProgramNode
            key={program.id}
            program={program}
            index={i}
            total={programs.length}
            radius={radius}
            isActive={activeProgramIndex === i}
            onHover={(idx) => setActiveProgramIndex(idx)}
            onUnhover={() => setActiveProgramIndex(null)}
          />
        ))}
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}
