import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Media from '@/components/common/Media';
import type { K12Program } from '@/types';

/**
 * The VCASS "CardGrid": square photo cards in a 2-up / 4-up grid on the
 * dark ground, each titled in condensed caps. Hovering grows a grey panel
 * out from behind the card and the cursor turns into a "View" disc.
 */
export default function ProgramGrid({
  programs,
  heading,
  action,
}: {
  programs: K12Program[];
  heading: string;
  action?: ReactNode;
}) {
  const reduce = useReducedMotion();
  if (programs.length === 0) return null;

  return (
    <section className="band-dark home-section">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="home-title text-neutral-2">{heading}</h2>
          {action}
        </div>
        {/* Pulled out by the card's own padding so the photos line up with
            the heading's edge instead of sitting a step inside it. */}
        <div className="mt-6 grid grid-cols-2 -mx-[clamp(0.5625rem,0.4609rem+0.4348vw,1rem)] lg:grid-cols-4">
          {programs.map((p, i) => (
            <motion.div
              key={p.id}
              className="vc-card"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.15 * (i % 4), ease: 'easeOut' }}
            >
              <Link to="/academics" data-cursor-text="View" className="flex flex-1 flex-col">
                <div className="vc-card__media aspect-square bg-neutral-6">
                  <Media src={p.coverUrl} alt={p.title} />
                </div>
                <div className="flex-1 px-1 pb-1 pt-4 md:px-2">
                  <h3 className="vc-card__title text-2xl text-neutral-2 md:text-3xl lg:text-4xl">
                    {p.title}
                  </h3>
                  <p className="vc-card__text vc-label mt-2 text-neutral-4">{p.grades}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
