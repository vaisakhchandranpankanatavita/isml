import { Suspense, lazy, useEffect, useRef, useState } from 'react';

/**
 * Ambient point-field behind the footer's dark ground — the one other
 * orchestrated motion moment on the site, bookending the hero's footage at
 * the bottom of every page. Kept to the same restraint as everything else
 * here: a slow drift, brand-tinted, never asked to mean more than "this
 * ground has depth."
 *
 * The three.js/fiber bundle is real weight, so nothing below the fold pays
 * for it: the canvas only mounts once the footer is actually approaching the
 * viewport, and never mounts at all for `prefers-reduced-motion` or for a
 * browser that can't do WebGL — the footer reads perfectly well as flat
 * `bg-ink` without it.
 */

const Scene = lazy(() => import('./FooterFieldScene'));

function useNearViewport<T extends Element>(margin = '200px') {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin, near]);

  return { ref, near };
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

export default function FooterField() {
  const { ref, near } = useNearViewport<HTMLDivElement>();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div ref={ref} aria-hidden className="absolute inset-0 overflow-hidden">
      {near && !reducedMotion && (
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      )}
    </div>
  );
}
