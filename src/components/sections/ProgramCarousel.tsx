import { Component, Suspense, useState, lazy, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import type { K12Program as Program } from "@/types";
import ProgramOverlay from "./ProgramOverlay";

// Lazy load the 3D scene to keep initial load fast
const CarouselScene = lazy(() => import("./CarouselScene"));

interface ProgramCarouselProps {
  programs: Program[];
}

function ProgramGrid({ programs }: ProgramCarouselProps) {
  return (
    <div className="grid grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => (
        <div
          key={program.id}
          className="glass p-4 rounded-2xl transition-all hover:scale-105"
        >
          {program.coverUrl && (
            <img
              src={program.coverUrl}
              alt={program.title}
              className="aspect-[4/3] object-cover rounded-xl mb-4"
            />
          )}
          <p className="text-xs font-semibold text-brand-600 uppercase">
            {program.grades}
          </p>
          <h3 className="font-display text-xl font-bold text-ink">
            {program.title}
          </h3>
        </div>
      ))}
    </div>
  );
}

/**
 * The 3D scene loads cover images as WebGL textures, which throws when a remote
 * host omits CORS headers, the network drops, or WebGL is unavailable. Left
 * uncaught that error reaches the router's `errorElement` and the whole
 * homepage renders as "We can't find that page" — so contain it here and fall
 * back to the plain grid.
 */
class SceneBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn(
      "[ProgramCarousel] 3D scene failed, showing grid fallback:",
      error,
    );
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function ProgramCarousel({ programs }: ProgramCarouselProps) {
  const [activeProgramIndex, setActiveProgramIndex] = useState<number | null>(
    null,
  );

  // Reduced motion fallback: a clean, modern grid
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    return <ProgramGrid programs={programs} />;
  }

  return (
    <SceneBoundary fallback={<ProgramGrid programs={programs} />}>
      <div className="relative w-full h-[700px] overflow-hidden bg-paper/30 rounded-3xl border border-paper-line">
        {/* 3D Canvas Layer */}
        <div className="absolute inset-0 z-0">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full text-ink-muted">
                Initializing 3D Journey...
              </div>
            }
          >
            <Canvas
              shadows
              camera={{ position: [0, 2, 8], fov: 50 }}
              gl={{ antialias: true, alpha: true }}
            >
              <CarouselScene
                programs={programs}
                activeProgramIndex={activeProgramIndex}
                setActiveProgramIndex={setActiveProgramIndex}
              />
            </Canvas>
          </Suspense>
        </div>

        {/* UI Overlay Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <ProgramOverlay
            program={
              activeProgramIndex !== null ? programs[activeProgramIndex] : null
            }
          />
        </div>

        {/* Instructions Hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <p className="text-xs font-medium text-ink-muted uppercase tracking-widest animate-pulse">
            Interact to explore the journey
          </p>
        </div>
      </div>
    </SceneBoundary>
  );
}
