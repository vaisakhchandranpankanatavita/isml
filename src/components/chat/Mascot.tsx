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

/** Compact AI mark: a speech bubble whose three dots ripple, with a small spark; the dots lean toward the pointer. */
export default function Mascot({ look, talking = false }: { look: Look; talking?: boolean }) {
  return (
    <span className="cb-bot" data-talking={talking || undefined} aria-hidden>
      <svg className="cb-bot__spark" viewBox="0 0 24 24">
        <path className="cb-bot__bubble" d="M5 3h11a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4h-5l-4.5 3.6c-.5.4-1.2 0-1.2-.6V17A4 4 0 0 1 1 13V7a4 4 0 0 1 4-4Z" transform="translate(1.5 .5)" />
        <motion.g style={{ x: look.x, y: look.y }}>
          <circle className="cb-bot__dot" cx="8.5" cy="10.5" r="1.4" />
          <circle className="cb-bot__dot cb-bot__dot--2" cx="13" cy="10.5" r="1.4" />
          <circle className="cb-bot__dot cb-bot__dot--3" cx="17.5" cy="10.5" r="1.4" />
        </motion.g>
      </svg>
    </span>
  );
}
