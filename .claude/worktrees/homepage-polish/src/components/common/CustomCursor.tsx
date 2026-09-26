import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

const SPRING = { stiffness: 280, damping: 28, mass: 0.6 };

/**
 * A crisp dot nested inside a fine vector ring. The ring trails the dot on a
 * spring, and both stretch toward any `[data-cursor-magnetic]` element the
 * pointer nears — a nav link, a button, the video hero — by biasing the
 * spring's *target*, not the element itself, toward that element's centre.
 *
 * Opt-in only, and only once two things are confirmed: a fine pointer
 * (`pointer: fine` — never hides the cursor on a touch device that has no
 * replacement for it) and no reduced-motion request. `index.css` reads the
 * `has-custom-cursor` class this sets on <html> to hide the native cursor;
 * without that class the native cursor is left alone.
 */
function usePointerFine() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setFine(mq.matches);
    const onChange = () => setFine(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return fine;
}

export default function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const fine = usePointerFine();
  const enabled = fine && !reduceMotion;

  const targetX = useMotionValue(-100);
  const targetY = useMotionValue(-100);
  const dotX = useSpring(targetX, { ...SPRING, stiffness: 500 });
  const dotY = useSpring(targetY, { ...SPRING, stiffness: 500 });
  const ringX = useSpring(targetX, SPRING);
  const ringY = useSpring(targetY, SPRING);
  const [magnet, setMagnet] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('has-custom-cursor', enabled);
    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      const magnetic = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        '[data-cursor-magnetic]',
      );
      if (magnetic) {
        const rect = magnetic.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        // Pulled mostly toward the element's centre, not fully onto it — a
        // "liquid gravity" bias rather than a snap.
        targetX.set(e.clientX * 0.35 + cx * 0.65);
        targetY.set(e.clientY * 0.35 + cy * 0.65);
        setMagnet(true);
      } else {
        targetX.set(e.clientX);
        targetY.set(e.clientY);
        setMagnet(false);
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, targetX, targetY]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="cursor-dot"
        style={{ x: dotX, y: dotY, marginLeft: -3, marginTop: -3 }}
      />
      <motion.div
        className="cursor-ring"
        style={{ x: ringX, y: ringY, marginLeft: -16, marginTop: -16 }}
        animate={{ scale: magnet ? 1.7 : 1 }}
        transition={SPRING}
      />
    </>
  );
}
