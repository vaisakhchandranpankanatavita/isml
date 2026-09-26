import { useState } from 'react';
import { Link } from 'react-router-dom';
import Media from '@/components/common/Media';
import type { HomeGalleryImage } from '@/types';

interface Props {
  images: HomeGalleryImage[];
  heading: string;
  body?: string;
  tourLink?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Compact "Experience @ISML" section — a three-photo collage (one large,
 * two stacked) with prev/next arrows cycling through the gallery, replacing
 * the old full-viewport 3D film strip. Sized to its content (no
 * `snap-section` min-height), matching the reference design's short,
 * masthead-style treatment rather than a cinematic set piece.
 */
export default function ExperienceGallery({ images, heading, body, tourLink }: Props) {
  const [start, setStart] = useState(0);
  const n = images.length;
  if (n === 0) return null;

  const at = (offset: number) => images[(start + offset + n) % n];
  const large = at(0);
  const smallTop = at(1);
  const smallBottom = at(2 % Math.max(n, 1));

  const advance = (dir: 1 | -1) => setStart((s) => (s + dir + n) % n);

  return (
    <section data-dark-ground className="flex flex-col bg-paper-sunk py-16 md:py-24">
      <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="font-display text-2xl font-bold leading-tight text-ink md:text-3xl">
            {heading}
          </h2>
          {body && <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft md:text-base">{body}</p>}
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            {tourLink && (
              <a
                href={tourLink}
                {...(/^https?:\/\//.test(tourLink) ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="inline-flex items-center justify-center gap-2 border border-marigold-500/70
                           px-6 py-2.5 text-sm font-medium text-marigold-500 transition-colors duration-300
                           hover:bg-marigold-500/10 focus-visible:outline-none
                           focus-visible:ring-2 focus-visible:ring-marigold-500"
              >
                Take a Virtual Tour
              </a>
            )}
            <Link
              to="/gallery"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-marigold-500"
            >
              Explore the campus <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="grid h-[20rem] grid-cols-2 grid-rows-2 gap-3 md:h-[24rem]">
            <div className="relative col-span-1 row-span-2 overflow-hidden border border-paper-line bg-paper-sunk">
              <Media src={large.url} alt={large.caption || heading} className="h-full w-full object-cover" />
              <span className="absolute bottom-3 left-3 text-2xs font-semibold tracking-widest text-ink-faint">
                {pad(start + 1)} / {pad(n)}
              </span>
            </div>
            <div className="relative overflow-hidden border border-paper-line bg-paper-sunk">
              <Media src={smallTop.url} alt={smallTop.caption || heading} className="h-full w-full object-cover" />
              {smallTop.caption && (
                <span className="absolute bottom-2 left-2 border border-paper-line bg-paper px-2 py-0.5 text-2xs text-ink-muted">
                  {smallTop.caption}
                </span>
              )}
            </div>
            <div className="relative overflow-hidden border border-paper-line bg-paper-sunk">
              <Media src={smallBottom.url} alt={smallBottom.caption || heading} className="h-full w-full object-cover" />
              {smallBottom.caption && (
                <span className="absolute bottom-2 left-2 border border-paper-line bg-paper px-2 py-0.5 text-2xs text-ink-muted">
                  {smallBottom.caption}
                </span>
              )}
            </div>
          </div>

          {n > 1 && (
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                type="button"
                onClick={() => advance(-1)}
                aria-label="Previous photo"
                className="flex h-9 w-9 items-center justify-center border border-paper-line bg-paper/70 text-ink transition-colors hover:border-marigold-500 hover:text-marigold-500"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => advance(1)}
                aria-label="Next photo"
                className="flex h-9 w-9 items-center justify-center border border-paper-line bg-paper/70 text-ink transition-colors hover:border-marigold-500 hover:text-marigold-500"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
