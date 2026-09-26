import { Component, type ReactNode, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { inSphere } from 'maath/random';
import type { Points as ThreePoints } from 'three';

const COUNT = 480;
const COLOR = '#3b82f6'; // brand-500

function Field() {
  const ref = useRef<ThreePoints>(null);
  const positions = useMemo(
    () => inSphere(new Float32Array(COUNT * 3), { radius: 1.6 }) as Float32Array,
    [],
  );

  useFrame((_, delta) => {
    if (!ref.current) return;
    // Barely perceptible on purpose — this should read as depth, not motion.
    ref.current.rotation.y += delta * 0.015;
    ref.current.rotation.x += delta * 0.004;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={COLOR}
        size={0.014}
        sizeAttenuation
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

/** A missing/blocked WebGL context should fall back to the flat `bg-ink` footer, not a crash. */
class WebglBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function FooterFieldScene() {
  return (
    <WebglBoundary>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 1] }}
        gl={{ alpha: true, antialias: false }}
      >
        <Field />
      </Canvas>
    </WebglBoundary>
  );
}
