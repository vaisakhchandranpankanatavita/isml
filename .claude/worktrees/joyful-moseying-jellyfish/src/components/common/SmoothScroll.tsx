import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** The live Lenis instance, or `null` under reduced motion / before mount. */
const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

/**
 * Normalizes trackpad/wheel scroll into Lenis's smoothed values and keeps
 * GSAP ScrollTrigger's measurements in lockstep with it. Without this,
 * ScrollTrigger reads the *native* scroll position while Lenis is still
 * easing toward it, and every pinned/parallax section built with `<Parallax>`
 * or `<HorizontalScrollSection>` jitters against the smoothing.
 *
 * Lenis must be the *only* thing moving the page. Native `scroll-behavior:
 * smooth` and CSS `scroll-snap` on `<html>` both re-target the scroll position
 * behind Lenis's back, which is what makes scrolling feel stuck — so neither
 * is used while Lenis runs (see `index.css`). Section-to-section snapping goes
 * through Lenis's own `Snap` (`useSectionSnap`) instead.
 *
 * Skipped entirely under reduced motion: native scroll, with the page's
 * `Parallax` layers also standing still (they check the same media query),
 * is the fallback — not a degraded version of this.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const instance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    instance.on('scroll', ScrollTrigger.update);

    const update = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      gsap.ticker.remove(update);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
