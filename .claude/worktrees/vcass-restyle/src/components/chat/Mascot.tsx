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

/** The assistant's face: a scholarly professor persona.
 *  An intellectual avatar with a minimal, academic look.
 *  Featuring rounded glasses, a subtle beard/goatee, and
 *  eyes that track the cursor and blink. */
export default function Mascot({ look, talking = false }: { look: Look; talking?: boolean }) {
  return (
    <span className="cb-bot" data-talking={talking || undefined} aria-hidden>
      <span className="cb-bot__aura" />
      <svg className="cb-bot__face" viewBox="0 0 64 64">
        {/* Academic Glasses */}
        <circle cx="22" cy="32" r="6" className="cb-bot__glasses" />
        <circle cx="42" cy="32" r="6" className="cb-bot__glasses" />
        <path d="M28 32 H36" className="cb-bot__glasses-bridge" />

        {/* Eyes tracking cursor */}
        <motion.circle className="cb-bot__eye" cx="22" cy="32" r="2" style={{ x: look.x, y: look.y }} />
        <motion.circle className="cb-bot__eye" cx="42" cy="32" r="2" style={{ x: look.x, y: look.y }} />

        {/* Professor's Goatee/Beard */}
        <path className="cb-bot__beard" d="M26 46 Q32 52 38 46 V42 H26 V46" />

        {/* Mouth that talks */}
        <path className="cb-bot__mouth" d="M28 42 Q32 44 36 42" />
      </svg>
    </span>
  );
}
