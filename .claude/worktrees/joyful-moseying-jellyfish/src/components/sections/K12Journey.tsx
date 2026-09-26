import { Link } from 'react-router-dom';
import InsidePovCarousel from '@/components/motion/InsidePovCarousel';
import type { K12Program } from '@/types';

interface Props {
  programs: K12Program[];
  heading: string;
}

/**
 * The child's journey through K-12: an inside-perspective 3D carousel — the
 * viewer stands at the centre of a ring of stage photographs, looking
 * outward, auto-rotating until dragged or focused (see InsidePovCarousel).
 * Replaces the earlier WebGL carousel, which threw whenever a stage's cover
 * photo was hosted off-origin — a <canvas> texture fetch has no CORS
 * fallback, unlike this carousel's plain <img> cards.
 */
export default function K12Journey({ programs, heading }: Props) {
  if (!programs.length) return null;

  return (
    <section
      data-dark-ground
      className="snap-section band band-line section-lg"
      aria-labelledby="k12-title"
    >
      <div className="container flex items-end justify-between gap-6">
        <div>
          <p className="rule-label">The journey</p>
          <h2 id="k12-title" className="text-2xl md:text-3xl">
            {heading}
          </h2>
        </div>
        <Link to="/academics" className="link hidden text-sm font-semibold sm:inline-flex">
          Academics in full
        </Link>
      </div>

      <div className="container mt-10">
        <InsidePovCarousel
          // The carousel's ring geometry wants many small angular steps (the
          // reference design assumes ~14 items); with only a handful of K-12
          // stages, mirroring the sequence keeps every card comfortably off
          // the exact-90° edge-on angle instead of two of four landing there.
          items={[...programs, ...programs].map((p) => ({
            src: p.coverUrl ?? '',
            alt: `${p.title}, ${p.grades}`,
          }))}
          label={`Photographs from every stage of ${heading}. Drag, or use the arrow keys, to look around.`}
        />
      </div>

      <div className="container mt-6 sm:hidden">
        <Link to="/academics" className="link text-sm font-semibold">
          Academics in full
        </Link>
      </div>
    </section>
  );
}
