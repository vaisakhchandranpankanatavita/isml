import { motion } from 'framer-motion';
import Media from '@/components/common/Media';
import type { K12Program as Program } from '@/types';

interface ProgramLadderProps {
  programs: Program[];
}

export default function ProgramLadder({ programs }: ProgramLadderProps) {
  return (
    <div className="relative flex flex-col gap-24 py-20">
      <div className="absolute left-0 top-0 h-full w-px bg-brand-600/20 md:left-1/2 md:-translate-x-1/2" />

      {programs.map((program, i) => (
        <motion.div
          key={program.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          className={`relative flex flex-col items-center gap-6 ${
            i % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
          }`}
        >
          <div className="absolute left-0 top-0 z-10 flex h-10 w-10 items-center justify-center md:left-1/2 md:-translate-x-1/2">
            <div className="h-full w-full rounded-full border-2 border-brand-600 bg-paper text-brand-700 font-display text-sm font-bold">
              {i + 1}
            </div>
          </div>

          <div className="relative w-full max-w-md pl-12 md:pl-0">
            <div className="group relative overflow-hidden bg-paper-sunk border border-paper-line transition-all duration-500 hover:border-brand-600/50">
              <div className="aspect-[4/3] overflow-hidden">
                <Media
                  src={program.coverUrl || ''}
                  alt={program.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                  {program.grades}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold text-ink">{program.title}</h3>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
