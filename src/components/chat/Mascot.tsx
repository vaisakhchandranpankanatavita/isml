import { useEffect, type RefObject } from 'react';
import { motion, useMotionValue, useSpring, type MotionValue } from 'framer-motion';

export interface Look {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

/**
 * Pupil offsets that follow the pointer across the whole page, measured from
 * the element `ref` points at — so the mascot appears to watch the cursor.
 * Springed so the eyes settle instead of snapping.
 */
export function usePointerLook(ref: RefObject<HTMLElement>, enabled = true): Look {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const x = useSpring(rx, { stiffness: 260, damping: 20 });
  const y = useSpring(ry, { stiffness: 260, damping: 20 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const k = Math.hypot(dx, dy) || 1;
      const reach = Math.min(k / 90, 1) * 2.6; // px the pupil may travel
      rx.set((dx / k) * reach);
      ry.set((dy / k) * reach);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, ref, rx, ry]);

  return { x, y };
}

/** A teacher-inspired assistant avatar with a squared face and spectacles. */
export default function Mascot({ look, talking = false }: { look: Look; talking?: boolean }) {
  return (
    <span className="cb-bot" data-talking={talking || undefined} aria-hidden>
      <svg className="cb-bot__face" viewBox="0 0 64 64">
        <path className="cb-bot__hair" d="M13 27 11 19 16 12 25 9 34 10 44 8 52 15 53 27 48 23 43 17 35 20 26 17 19 23Z" />
        <path className="cb-bot__head" d="M16 22 21 18 29 20 37 17 44 20 49 25V39Q49 49 40 54L32 58 24 54Q15 49 15 39V27Z" />
        <path className="cb-bot__ear" d="M15 31H12V39H16M49 31H52V39H48" />
        <path className="cb-bot__brow" d="m19 28 9-1m9 0 9 1" />
        <rect className="cb-bot__glasses" x="17" y="29" width="13" height="9" rx="2" />
        <rect className="cb-bot__glasses" x="34" y="29" width="13" height="9" rx="2" />
        <path className="cb-bot__glasses-bridge" d="M30 32H34M17 32l-3-1M47 32l3-1" />
        <motion.circle className="cb-bot__eye" cx="23.5" cy="33.5" r="1.5" style={{ x: look.x, y: look.y }} />
        <motion.circle className="cb-bot__eye" cx="40.5" cy="33.5" r="1.5" style={{ x: look.x, y: look.y }} />
        <path className="cb-bot__nose" d="m32 35-2 6h4" />
        <path className="cb-bot__mouth" d="M27 45Q32 49 37 45" />
        <path className="cb-bot__collar" d="m24 53 8 5 8-5" />
      </svg>
    </span>
  );
}
