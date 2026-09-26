import { motion, useReducedMotion, type Variants } from 'framer-motion';

type Tag = 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3';

interface ScaffoldedTextProps {
  text: string;
  /** Split unit. Word-by-word for headlines and long copy; char-by-char reads
   * as a tighter, more mechanical cascade — reserve it for short labels. */
  by?: 'word' | 'char';
  as?: Tag;
  className?: string;
  /** Animate on mount rather than waiting for the viewport — for anything
   * already visible at load, like the hero headline. Everything else should
   * reveal as the reader scrolls to it. */
  eager?: boolean;
}

const MOTION_TAGS = {
  div: motion.div,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
};

const EASE = [0, 0.65, 0.45, 1] as const;

/**
 * The VCASS headline reveal: every word starts clipped to nothing and 110px
 * low, then rises into place while its clip opens (`inset(0 0 100%)` →
 * `inset(0 0 -30%)` — the negative bottom lets descenders through). Words
 * cascade 50ms apart; an above-the-fold (`eager`) headline waits 0.5s so it
 * lands after the page curtain lifts.
 */
const piece: Variants = {
  hidden: { clipPath: 'inset(0 0 100%)', y: '110px' },
  show: (custom: { i: number; base: number }) => ({
    clipPath: 'inset(0% 0 -30%)',
    y: 0,
    transition: { delay: custom.base + 0.05 * custom.i, duration: 0.5, ease: EASE },
  }),
};

export default function ScaffoldedText({
  text,
  by = 'word',
  as = 'div',
  className,
  eager = false,
}: ScaffoldedTextProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = MOTION_TAGS[as];

  if (reduceMotion) {
    const Plain = as;
    return <Plain className={className}>{text}</Plain>;
  }

  const pieces = by === 'char' ? Array.from(text) : text.split(/(\s+)/);

  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate={eager ? 'show' : undefined}
      whileInView={eager ? undefined : 'show'}
      viewport={eager ? undefined : { once: true, amount: 0.3 }}
    >
      {pieces.map((chunk, i) =>
        /^\s+$/.test(chunk) ? (
          chunk
        ) : (
          <motion.span
            key={i}
            className="inline-block will-change-transform"
            variants={piece}
            custom={{ i: by === 'char' ? i * 0.4 : Math.floor(i / 2), base: eager ? 0.5 : 0 }}
          >
            {chunk}
          </motion.span>
        ),
      )}
    </MotionTag>
  );
}
