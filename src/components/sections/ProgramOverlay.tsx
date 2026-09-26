import { motion, AnimatePresence } from 'framer-motion';
import type { K12Program as Program } from '@/types';

interface ProgramOverlayProps {
  program: Program | null;
}

export default function ProgramOverlay({ program }: ProgramOverlayProps) {
  if (!program) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="glass max-w-md w-full p-8 text-center pointer-events-auto"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs font-semibold uppercase tracking-widest text-brand-600 mb-2"
          >
            {program.grades}
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-3xl font-bold text-ink leading-tight"
          >
            {program.title}
          </motion.h3>
          <div className="mt-6 h-px w-12 bg-brand-600 mx-auto" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
