import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

// Ring trail. Stiff and light so it keeps up with fast flicks instead of
// visibly lagging behind the pointer.
const SPRING = { stiffness: 1100, damping: 48, mass: 0.18 };

/**
 * A crisp dot nested inside a fine vector ring. Over a `[data-cursor-text]`
 * target (VCASS's cards) the ring swells into a solid amber disc carrying
 * that label ("View") and the dot fades out. The ring trails the dot on a
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
  // The dot is the pointer itself: it tracks the raw position with no easing,
  // so the cursor never feels delayed. Only the ring trails.
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(targetX, SPRING);
  const ringY = useSpring(targetY, SPRING);
  const [magnet, setMagnet] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  // Over the chat widget the native cursor takes over (see chatbot.css), so
  // the dot and ring get out of the way of its buttons and text field.
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('has-custom-cursor', enabled);
    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      const target = e.target as HTMLElement | null;
      setHidden(!!target?.closest('[data-native-cursor]'));
      const labelled = target?.closest<HTMLElement>('[data-cursor-text]');
      setLabel(labelled?.dataset.cursorText || null);
      const magnetic = target?.closest<HTMLElement>('[data-cursor-magnetic]');
      if (magnetic) {
        const rect = magnetic.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        // Only the ring leans toward the element's centre — a light bias,
        // so the cursor still goes where the hand goes.
        targetX.set(e.clientX * 0.7 + cx * 0.3);
        targetY.set(e.clientY * 0.7 + cy * 0.3);
        setMagnet(true);
      } else {
        targetX.set(e.clientX);
        targetY.set(e.clientY);
        setMagnet(false);
      }
    };

    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    document.documentElement.addEventListener('pointerenter', onEnter);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.documentElement.removeEventListener('pointerenter', onEnter);
    };
  }, [enabled, targetX, targetY, dotX, dotY]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="cursor-dot z-[210]"
        style={{ x: dotX, y: dotY, marginLeft: -4, marginTop: -4 }}
        animate={{ opacity: label || hidden ? 0 : 1 }}
        transition={{ duration: 0.12 }}
      />
      <motion.div
        className={label ? 'cursor-ring cursor-ring--label z-[210]' : 'cursor-ring z-[210]'}
        style={{ x: ringX, y: ringY, marginLeft: -16, marginTop: -16 }}
        animate={{ scale: label ? 2.4 : magnet ? 1.5 : 1, opacity: hidden ? 0 : 1 }}
        transition={{ ...SPRING, opacity: { duration: 0.12 } }}
      >
        {label}
      </motion.div>
    </>
  );
}
