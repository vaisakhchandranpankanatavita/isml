import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { K12Program } from '@/types';

/**
 * "K-12 Journey of your child" — a horizontal five-stop timeline (gold
 * numbered circles on a connecting rule), matching the reference brief.
 * Replaces the vertical stage rail that used to live folded into the dark
 * NewsShowcase section — this is its own light, content-height section.
 */

interface Props {
  programs: K12Program[];
  heading: string;
}

export default function K12Journey({ programs, heading }: Props) {
  if (programs.length === 0) return null;

  return (
    <section className="section-lg">
      <div className="container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">{heading}</h2>
          </div>
          <div className="max-w-sm md:text-right">
            <p className="body-copy text-sm md:ml-auto">
              A seamless journey of academic excellence, character building and lifelong skills.
            </p>
            <Link
              to="/academics"
              className="link mt-2 inline-flex items-center gap-1 text-sm font-semibold md:justify-end"
            >
              Explore our curriculum <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <ol className="relative mt-14 grid gap-y-10 sm:grid-cols-5 sm:gap-x-4">
          <div aria-hidden className="absolute left-0 right-0 top-6 hidden h-px bg-paper-line sm:block" />
          {programs.map((program, i) => (
            <motion.li
              key={program.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
              className="relative flex flex-col items-center text-center"
            >
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center bg-marigold-500 font-display text-base font-bold text-paper">
                {i + 1}
              </span>
              <span className="mt-4 font-display text-sm font-semibold text-ink">{program.title}</span>
              <span className="mt-1 text-xs uppercase tracking-wide text-ink-muted">{program.grades}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
