import { useRef, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText, EASE_REF, EASE_IMAGE } from "./gsap";

const num = (v: string | null, fallback: number) => {
  const n = v == null ? NaN : parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

/**
 * Attribute-driven scroll reveals, ported from the reference site's
 * features script. Mark up an element with `data-r` and the role:
 *
 *   fade         blur(10px)+0 -> sharp+1      1s, delay .6
 *   fade-up      y 40 -> 0, opacity           .4s, delay .4
 *   image        scale 1.10 -> 1, opacity     1s, delay .4, start "top 80%"
 *   chars        per-letter blur-in           1.3s, stagger .1
 *   words        per-word blur-in             1s, stagger .06
 *   scramble     scrambled text resolves      2s
 *   top-opacity  scrubbed fade-out as it leaves the top
 *
 * `data-delay` overrides the delay. Run once per page; it cleans itself up.
 */
export function useReferenceMotion(deps: unknown[] = []): RefObject<HTMLDivElement> {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      // Blur filters are costly to animate on phones: use opacity only there.
      const blurIn = window.matchMedia("(max-width: 991px)").matches ? "blur(0px)" : "blur(10px)";

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = (role: string) =>
          gsap.utils.toArray<HTMLElement>(root.querySelectorAll(`[data-r="${role}"]`));

        q("fade").forEach((el) => {
          gsap.fromTo(
            el,
            { filter: blurIn, opacity: 0 },
            {
              filter: "blur(0px)",
              opacity: 1,
              ease: EASE_REF,
              duration: 1,
              delay: num(el.dataset.delay ?? null, 0.6),
              scrollTrigger: { trigger: el, start: "top bottom" },
            },
          );
        });

        q("fade-up").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              ease: EASE_REF,
              duration: 0.4,
              delay: num(el.dataset.delay ?? null, 0.4),
              scrollTrigger: { trigger: el, start: "top bottom" },
            },
          );
        });

        q("image").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, scale: 1.1 },
            {
              opacity: 1,
              scale: 1,
              ease: EASE_IMAGE,
              duration: 1,
              delay: num(el.dataset.delay ?? null, 0.4),
              scrollTrigger: { trigger: el, start: "top 80%" },
            },
          );
        });

        (["chars", "words"] as const).forEach((role) => {
          q(role).forEach((el) => {
            el.style.opacity = "1";
            const split = SplitText.create(el, { type: role });
            const parts = role === "chars" ? split.chars : split.words;
            gsap.set(parts, { opacity: 0, filter: blurIn });
            gsap.to(parts, {
              opacity: 1,
              filter: "blur(0px)",
              duration: role === "chars" ? 1.3 : 1,
              stagger: role === "chars" ? Math.min(0.1, 1.4 / parts.length) : 0.06,
              delay: num(el.dataset.delay ?? null, 0.2),
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 100%" },
            });
          });
        });

        q("scramble").forEach((el) => {
          const text = el.textContent ?? "";
          if (!text) return;
          gsap.to(el, {
            duration: 2,
            delay: num(el.dataset.delay ?? null, 0.4),
            scrambleText: {
              text,
              chars: el.dataset.chars || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
              revealDelay: 0.8,
              speed: 0.8,
            },
            scrollTrigger: { trigger: el, start: "top bottom" },
          });
        });

        q("top-opacity").forEach((el) => {
          const start = num(el.dataset.start ?? null, 5);
          const end = num(el.dataset.end ?? null, 30);
          gsap.fromTo(
            el,
            { opacity: 1 },
            {
              opacity: 0,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: `top -${start}%`,
                end: `top -${end}%`,
                scrub: true,
              },
            },
          );
        });
      });

      // New layout may have shifted after images decode.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      return () => {
        window.removeEventListener("load", refresh);
        mm.revert();
      };
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  );

  return scope;
}
