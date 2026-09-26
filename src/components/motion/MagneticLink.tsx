import { type ReactNode, useRef } from 'react';
import { motion, useReducedMotion, useSpring } from 'framer-motion';
import clsx from 'clsx';

const PULL_SPRING = { stiffness: 280, damping: 28, mass: 0.6 };
/** Loose, low-friction — the underline should drift into place, not snap. */
const UNDERLINE_SPRING = { stiffness: 80, damping: 15 };
/** Fraction of the raw pointer offset actually applied — "subtle", per the
 * brief, not a hard snap to the cursor. */
const PULL = 0.3;

/**
 * Wraps a nav link with a subtle magnetic pull toward the pointer, plus a
 * spring-driven centre-out underline. Also tags itself `data-cursor-magnetic`
 * so `CustomCursor` stretches its ring toward it.
 */
export default function MagneticLink({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useSpring(0, PULL_SPRING);
  const y = useSpring(0, PULL_SPRING);
  const scaleX = useSpring(0, UNDERLINE_SPRING);

  const onMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * PULL);
    y.set((e.clientY - (rect.top + rect.height / 2)) * PULL);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
    scaleX.set(0);
  };

  return (
    <motion.span
      ref={ref}
      data-cursor-magnetic
      onMouseMove={onMouseMove}
      onMouseEnter={() => scaleX.set(1)}
      onMouseLeave={onMouseLeave}
      onFocus={() => scaleX.set(1)}
      onBlur={() => scaleX.set(0)}
      style={reduceMotion ? undefined : { x, y }}
      className={clsx('relative inline-flex items-center', className)}
    >
      {children}
      <motion.span
        aria-hidden
        style={{ scaleX }}
        className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-center bg-current"
      />
    </motion.span>
  );
}
