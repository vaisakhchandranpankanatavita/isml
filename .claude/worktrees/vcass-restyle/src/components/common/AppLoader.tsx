import { useEffect, useState } from 'react';
import { animate, AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useSiteSettings } from '@/hooks/useSiteSettings';

/**
 * First-load splash, shown once per hard page load (it lives above the
 * router in `main.tsx`, so client-side navigation never re-triggers it; the
 * per-route curtain in PublicLayout covers navigation). Waits for web fonts
 * so the page never reveals in a fallback face.
 */
const HOLD_MS = 900;
const HOLD_REDUCED_MS = 200;

export default function AppLoader() {
  const reduced = useReducedMotion();
  const { settings } = useSiteSettings();
  const [visible, setVisible] = useState(true);

  const progress = useMotionValue(0);
  const scaleX = useTransform(progress, (v) => v / 100);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const ran = new Promise<void>((resolve) => {
      animate(progress, 100, {
        duration: (reduced ? HOLD_REDUCED_MS : HOLD_MS) / 1000,
        ease: 'easeInOut',
        onComplete: resolve,
      });
    });
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    let t: number;
    Promise.all([ran, fontsReady]).then(() => {
      t = window.setTimeout(() => setVisible(false), reduced ? 0 : 150);
    });
    return () => window.clearTimeout(t);
  }, [progress, reduced]);

  useEffect(() => {
    if (!visible) document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        // VCASS load curtain: near-black sheet, crest centred, a thin amber
        // progress rule. It leaves by closing its clip from the bottom while
        // drifting up 10% (the reference's `background-anim` exit).
        <motion.div
          className="fixed inset-0 z-[1001] flex flex-col items-center justify-center gap-6 bg-neutral-7"
          role="status"
          aria-label="Loading"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)', y: '0%' }}
          exit={
            reduced
              ? { opacity: 0, transition: { duration: 0.2 } }
              : { clipPath: 'inset(0% 0% 90% 0%)', y: '-10%', transition: { duration: 0.6, ease: 'easeOut' } }
          }
        >
          <img src="/logo.png" alt="" className="w-24 md:w-32" />
          <motion.p
            className="font-display text-2xl font-extrabold uppercase leading-none text-neutral-2"
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
          >
            {settings.siteName || 'Indian School Muladha'}
          </motion.p>
          <div className="h-px w-32 overflow-hidden bg-neutral-6">
            <motion.span className="block h-full origin-left bg-[#f59021]" style={{ scaleX }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
