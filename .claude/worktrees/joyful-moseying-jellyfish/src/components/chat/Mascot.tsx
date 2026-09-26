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

/** The assistant's face: a diffused aurora sphere with a minimal white
 * vector-line face — high curved brows, dot eyes that track the cursor and
 * blink, an L-shaped nose, and a mouth that talks while `talking`. The aura
 * is CSS gradients (blurred, layered, self-hosted — no image asset); the
 * face is inline SVG so the brow/nose curves stay crisp at any `--s`. */
export default function Mascot({ look, talking = false }: { look: Look; talking?: boolean }) {
  return (
    <span className="cb-bot" data-talking={talking || undefined} aria-hidden>
      <span className="cb-bot__aura" />
      <svg className="cb-bot__face" viewBox="0 0 64 64">
        <path className="cb-bot__brow" d="M12 26 Q20 15 30 22" />
        <path className="cb-bot__brow" d="M34 22 Q44 15 52 26" />
        <motion.circle className="cb-bot__eye" cx="22" cy="34" r="2.8" style={{ x: look.x, y: look.y }} />
        <motion.circle className="cb-bot__eye" cx="42" cy="34" r="2.8" style={{ x: look.x, y: look.y }} />
        <path className="cb-bot__nose" d="M32 30 V42 H39" />
        <path className="cb-bot__mouth" d="M26 49 Q32 51.5 38 49" />
      </svg>
    </span>
  );
}
