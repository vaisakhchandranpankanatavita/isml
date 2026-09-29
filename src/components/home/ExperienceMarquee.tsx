import { useEffect, useRef, useState } from "react";
import type { HomeGalleryImage } from "@/types";

const FALLBACK: HomeGalleryImage[] = [
  ["annual-day.jpg", "Annual day"],
  ["onam.jpg", "Onam celebration"],
  ["science-forum.jpg", "Science forum"],
  ["sports-day.jpg", "Sports day"],
  ["youth-festival.jpg", "Youth festival"],
  ["scouts.jpg", "Scouts"],
  ["kg-park.jpg", "KG park"],
].map(([name, caption]) => ({ id: name, url: `${import.meta.env.BASE_URL}home/${name}`, caption }));

const MAX_PANELS = 7;

/**
 * Dark section with a strip of campus photos. One photo is open at a time;
 * hover, focus or tap opens another. On small screens the strip scrolls sideways.
 */
export default function ExperienceMarquee({
  heading,
  body,
  images,
}: {
  heading: string;
  body?: string;
  images: HomeGalleryImage[];
}) {
  const photos = (images.length >= 4 ? images : FALLBACK).slice(0, MAX_PANELS);
  const [active, setActive] = useState(0);
  const strip = useRef<HTMLUListElement>(null);

  // On phones the strip scrolls sideways: the panel nearest the centre is the open one.
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    let raf = 0;
    const sync = () => {
      raf = 0;
      if (el.scrollWidth <= el.clientWidth + 1) return; // desktop: hover/focus drives it
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(el.children).forEach((child, i) => {
        const c = child as HTMLElement;
        const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
        if (dist < bestDist) [best, bestDist] = [i, dist];
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sync);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section data-role-section="dark" className="overflow-hidden home-section" aria-labelledby="exp-title">
      <div className="container grid gap-8 md:grid-cols-[1fr_minmax(0,24rem)] md:items-end md:gap-16">
        <h2
          id="exp-title"
          data-r="chars"
          className="max-w-[12ch] text-[clamp(2.75rem,10vw,10rem)] leading-[1.02] tracking-[-0.02em]"
        >
          {heading}
        </h2>
        {body && (
          <p data-r="fade-up" className="body-copy md:pb-4">
            {body}
          </p>
        )}
      </div>

      <div className="container home-gap exp-bleed">
        <ul ref={strip} className="exp-strip">
          {photos.map((img, i) => (
            <li key={img.id} className="exp-panel" data-active={i === active || undefined}>
              <button
                type="button"
                className="exp-panel__btn"
                aria-pressed={i === active}
                aria-label={img.caption || `Photo ${i + 1}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <img src={img.url} alt="" loading="lazy" data-parallax="off" />
                {img.caption && <span className="exp-panel__cap">{img.caption}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
