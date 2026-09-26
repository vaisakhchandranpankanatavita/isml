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

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};

const piece: Variants = {
  hidden: { y: '110%' },
  show: {
    y: '0%',
    transition: { type: 'spring', stiffness: 280, damping: 28, mass: 0.6 },
  },
};

/**
 * Scaffolded text reveal: each word (or character) sits in its own masked
 * box and slides up out of it in a tight, staggered cascade — never a plain
 * fade. Each mask is a real hard edge (`overflow-hidden`), not a fade-based
 * approximation of one.
 */
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
      variants={container}
      initial="hidden"
      animate={eager ? 'show' : undefined}
      whileInView={eager ? undefined : 'show'}
      viewport={eager ? undefined : { once: true, amount: 0.5 }}
    >
      {pieces.map((chunk, i) =>
        /^\s+$/.test(chunk) ? (
          chunk
        ) : (
          <span
            key={i}
            className="inline-block overflow-hidden"
            style={{ verticalAlign: 'bottom' }}
          >
            <motion.span className="inline-block" variants={piece}>
              {chunk}
            </motion.span>
          </span>
        ),
      )}
    </MotionTag>
  );
}
