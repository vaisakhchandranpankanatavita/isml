import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxProps {
  children: ReactNode;
  /** 1.0 tracks the scroll exactly (foreground). Below 1 lags behind it —
   * the brief's "background lettering at 0.4x", or a split-grid column's
   * image at 0.85x against its text column's 1.0x. Above 1 leads ahead. */
  speed?: number;
  className?: string;
}

/**
 * Asynchronous scroll layer. Reads its own scroll progress through the
 * viewport via GSAP ScrollTrigger's `scrub`, which tracks the Lenis-smoothed
 * position `SmoothScroll` keeps ScrollTrigger in sync with — not the raw,
 * possibly-stepped native scroll value.
 */
export default function Parallax({ children, speed = 0.6, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const distance = (1 - speed) * 100; // % of element height it travels, total
    const tween = gsap.fromTo(
      el,
      { yPercent: -distance / 2 },
      {
        yPercent: distance / 2,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}
