import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/motion/gsap";

/** The live Lenis instance, or `null` under reduced motion / before mount. */
const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

/**
 * Lenis drives the smoothing (the reference uses ScrollSmoother at 1.5s; a
 * lerp of ~0.075 gives the same glide) and is the single source of scroll
 * position for ScrollTrigger, so pins and scrubs stay in lockstep.
 *
 * Skipped under reduced motion: native scroll, and no `js-motion` class, so
 * reveal start-states never hide content.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const html = document.documentElement;
    html.classList.add("js-motion");

    const instance = new Lenis({ lerp: 0.075, wheelMultiplier: 1, smoothWheel: true });
    instance.on("scroll", ScrollTrigger.update);
    const update = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    // Images fade in as they decode (CSS keys off `.is-loaded`), and pins are
    // re-measured once after a burst of loads rather than on every image.
    let refreshTimer = 0;
    const onImgLoad = (e: Event) => {
      const t = e.target;
      if (!(t instanceof HTMLImageElement)) return;
      t.classList.add("is-loaded");
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    };
    document.addEventListener("load", onImgLoad, true);
    document.querySelectorAll("img").forEach((img) => img.complete && img.classList.add("is-loaded"));

    return () => {
      document.removeEventListener("load", onImgLoad, true);
      window.clearTimeout(refreshTimer);
      html.classList.remove("js-motion");
      gsap.ticker.remove(update);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
