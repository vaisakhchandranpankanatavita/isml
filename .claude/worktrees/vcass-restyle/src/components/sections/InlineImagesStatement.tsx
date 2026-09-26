import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import Media from '@/components/common/Media';

export interface StatementSegment {
  text: string;
  /** Thumbnail set into the line after this segment's words. */
  image?: string;
}

/**
 * The VCASS "TextInlineImages" block: one very large centred statement with
 * small rounded photographs set inline between its phrases, on the dark
 * ground, followed by a condensed lead paragraph and a call to action.
 *
 * Each phrase rises out of a mask as it scrolls in (the same reveal as the
 * hero headline); each thumbnail opens out of a 5% inset.
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
    <section className="band-dark relative py-[clamp(7.875rem,6.2199rem+7.0807vw,15rem)] text-center">
      <div className="container">
        <motion.h2
          className="mx-auto max-w-[80rem] text-[clamp(2.5257rem,1.3817rem+4.8943vw,7.4506rem)] leading-[0.9] text-neutral-2"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {segments.map((seg, i) => {
            const offset = segments.slice(0, i).reduce((n, sg) => n + sg.text.split(' ').length, 0);
            return (
              <span key={i}>
                {seg.text.split(' ').map((word, w) => (
                  <span key={w}>
                    <motion.span
                      className="inline-block"
                      variants={
                        reduce
                          ? undefined
                          : {
                              hidden: { clipPath: 'inset(0 0 100%)', y: 60 },
                              show: {
                                clipPath: 'inset(0% 0 -30%)',
                                y: 0,
                                transition: {
                                  delay: 0.04 * (offset + w),
                                  duration: 0.6,
                                  ease: [0, 0.65, 0.45, 1],
                                },
                              },
                            }
                      }
                    >
                      {word}
                    </motion.span>{' '}
                  </span>
                ))}
                {seg.image && (
                  <>
                    <motion.span
                      className="inline-block w-[clamp(2.5257rem,1.3817rem+4.8943vw,7.4506rem)] translate-y-[0.06em] overflow-hidden rounded-[8px] align-baseline"
                      variants={
                        reduce
                          ? undefined
                          : {
                              hidden: { opacity: 0, clipPath: 'inset(5% round 8px)' },
                              show: {
                                opacity: 1,
                                clipPath: 'inset(0% round 8px)',
                                transition: { delay: 0.04 * offset + 0.3, duration: 0.7, ease: 'easeOut' },
                              },
                            }
                      }
                    >
                      <span className="relative block aspect-[116/84]">
                        <span className="absolute inset-0">
                          <Media src={seg.image} alt="" />
                        </span>
                      </span>
                    </motion.span>{' '}
                  </>
                )}
              </span>
            );
          })}
        </motion.h2>

        {(lead || children) && (
          <motion.div
            className="mx-auto mt-[clamp(2.625rem,2.5379rem+0.3727vw,3rem)] max-w-3xl"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {lead && (
              <p className="font-display text-2xl font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-3 md:text-4xl">
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
