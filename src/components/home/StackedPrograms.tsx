import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/motion/gsap";
import type { K12Program } from "@/types";

const STAGE_DESCRIPTIONS: Record<string, string> = {
  foundational: "A confident first step, built on wonder.",
  preparatory: "Growing ideas, skills and independence.",
  middle: "Finding new interests. Asking bigger questions.",
  senior: "Preparing for the path that comes next.",
};

const FALLBACK_PHOTOS = [
  "home/kg-park.jpg",
  "home/science-forum.jpg",
  "home/youth-festival.jpg",
  "home/sports-day.jpg",
];

/**
 * Pinned card stack from the reference's gallery: cards share one grid cell,
 * the first on top. The section pins for (n-1) viewport heights and each card
 * in turn lifts away (y -150%, scale .95) to reveal the next. Stacked plainly
 * under reduced motion.
 */
export default function StackedPrograms({ programs }: { programs: K12Program[] }) {
  const outer = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = outer.current;
      if (!el || programs.length < 2) return;
      const cards = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-card]"));
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline();
        cards.forEach((_card, i) => {
          if (i === 0) return;
          tl.to(cards[i - 1], { y: "-150%", scale: 0.95, duration: 1, ease: "none" });
        });
        ScrollTrigger.create({
          animation: tl,
          trigger: el,
          start: () => `top ${window.innerWidth >= 992 ? 14 : 12}%`,
          end: () => `+=${window.innerHeight * (cards.length - 1)}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      });
      return () => mm.revert();
    },
    { scope: outer, dependencies: [programs.length] },
  );

  if (programs.length === 0) return null;

  return (
    <section id="journey" className="home-section" aria-labelledby="journey-title">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p data-r="fade-up" className="vc-label">
              The learning journey
            </p>
            <h2
              id="journey-title"
              data-r="words"
              className="mt-6 text-[clamp(2.75rem,10vw,10rem)] leading-[1.02] tracking-[-0.02em]"
            >
              Room to grow. Every step.
            </h2>
          </div>
          <div className="flex flex-col items-start justify-end gap-6 lg:col-span-4">
            <p data-r="fade-up" className="body-copy">
              Every age brings a new way of seeing the world. We meet each stage with the right mix of challenge, care
              and discovery.
            </p>
            <Link to="/academics" data-r="fade-up" className="r-nav-link">
              Explore academics ↗
            </Link>
          </div>
        </div>

        <div
          ref={outer}
          className="r-stack home-gap flex flex-col gap-6 motion-safe:grid motion-safe:gap-0"
        >
          {programs.map((program, i) => {
            const cover = program.coverUrl || `${import.meta.env.BASE_URL}${FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length]}`;
            const description =
              STAGE_DESCRIPTIONS[program.title.trim().toLowerCase()] ??
              "A strong foundation for the next stage of learning.";
            return (
              <article
                key={program.id}
                data-card
                className="r-stack__card relative h-[52svh] min-h-[22rem] overflow-hidden rounded-[0.5rem] bg-obsidian text-neutral-1 motion-safe:[grid-area:1/1] lg:h-[62svh]"
                style={{ zIndex: programs.length - i }}
              >
                <img
                  src={cover}
                  alt=""
                  loading="lazy"
                  data-parallax="off"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col justify-between gap-6 p-8 md:flex-row md:items-end md:p-12">
                  <div>
                    <p className="vc-label text-lime">
                      {String(i + 1).padStart(2, "0")} / {String(programs.length).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 text-[clamp(2.5rem,7.5vw,7.5rem)] leading-[1]">{program.title}</h3>
                  </div>
                  <div className="max-w-xs md:text-right">
                    <p className="font-display text-3xl uppercase leading-none text-lime">{program.grades}</p>
                    <p className="mt-3 text-lg font-medium leading-snug text-neutral-2">{description}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
