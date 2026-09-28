import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export interface StatementSegment {
  text: string;
}

/**
 * A large centred text statement on the dark ground, followed by a condensed
 * lead paragraph and a call to action.
 *
 * Each phrase rises out of a mask as it scrolls in (the same reveal as the
 * hero headline).
 */
export default function InlineImagesStatement({
  segments,
  lead,
  children,
}: {
  segments: StatementSegment[];
  lead?: string;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <section className="band-dark home-section home-intro-section relative text-center">
      <div className="container">
        <motion.h2
          className="mx-auto max-w-[58rem] text-[clamp(2rem,1.35rem+3vw,4.25rem)] leading-[0.98] tracking-[-0.035em] text-neutral-2"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {segments.map((seg, i) => {
            const offset = segments
              .slice(0, i)
              .reduce((n, sg) => n + sg.text.split(" ").length, 0);
            return (
              <span key={i}>
                {seg.text.split(" ").map((word, w) => (
                  <span key={w}>
                    <motion.span
                      className="inline-block"
                      variants={
                        reduce
                          ? undefined
                          : {
                              hidden: { clipPath: "inset(0 0 100%)", y: 24 },
                              show: {
                                clipPath: "inset(0% 0 -30%)",
                                y: 0,
                                transition: {
                                  delay: 0.025 * (offset + w),
                                  duration: 0.45,
                                  ease: [0, 0.65, 0.45, 1],
                                },
                              },
                            }
                      }
                    >
                      {word}
                    </motion.span>{" "}
                  </span>
                ))}
              </span>
            );
          })}
        </motion.h2>

        {(lead || children) && (
          <motion.div
            className="mx-auto mt-6 max-w-4xl sm:mt-8"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {lead && (
              <p className="mx-auto max-w-[64ch] text-base leading-[1.7] text-neutral-3 sm:text-lg">
                {lead}
              </p>
            )}
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
