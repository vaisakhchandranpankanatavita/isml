import { useReducedMotion } from "framer-motion";

/**
 * The homepage's one scroll-reveal: a short rise and fade, eased out, played
 * once. Returns a factory so each element can stagger with its own delay.
 * Under reduced motion it returns no animation props, so content renders in
 * place with nothing hidden.
 */
export function useReveal() {
  const reduce = useReducedMotion();
  return (delay = 0, distance = 18) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: distance },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.25 },
          transition: {
            duration: 0.7,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };
}
