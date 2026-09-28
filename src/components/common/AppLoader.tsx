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
        <motion.div
          className="fixed inset-0 z-[1001] isolate flex flex-col items-center justify-center gap-6 overflow-hidden bg-[#fffaf2]"
          role="status"
          aria-label="Loading"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)', y: '0%' }}
          exit={
            reduced
              ? { opacity: 0, transition: { duration: 0.2 } }
              : { clipPath: 'inset(0% 0% 90% 0%)', y: '-10%', transition: { duration: 0.6, ease: 'easeOut' } }
          }
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#ffffff_0%,_#fffaf2_56%,_#f7ead7_100%)]" />
            {!reduced && (
              <>
                <motion.div
                  className="absolute -left-[18%] -top-[35%] h-[90vw] w-[90vw] rounded-full bg-[#f5bd70]/25 blur-3xl"
                  animate={{ x: ['-3%', '8%', '-3%'], y: ['0%', '12%', '0%'], scale: [1, 1.12, 1] }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute -bottom-[45%] -right-[18%] h-[85vw] w-[85vw] rounded-full bg-[#a9c8b6]/30 blur-3xl"
                  animate={{ x: ['4%', '-8%', '4%'], y: ['0%', '-10%', '0%'], scale: [1.08, 0.96, 1.08] }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute left-1/2 top-1/2 h-[min(70vw,38rem)] w-[min(70vw,38rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-prestige-gold/15"
                  animate={{ rotate: 360, scale: [0.96, 1.04, 0.96] }}
                  transition={{ rotate: { duration: 36, repeat: Infinity, ease: 'linear' }, scale: { duration: 9, repeat: Infinity, ease: 'easeInOut' } }}
                />
              </>
            )}
          </div>
          <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
            <motion.img
              src="/logo.png"
              alt=""
              className="w-24 md:w-32"
              initial={reduced ? false : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05, duration: 0.55, ease: 'easeOut' }}
            />
            <motion.p
              className="font-display text-2xl font-bold uppercase leading-none md:text-3xl"
              style={{ color: '#1f1e1d' }}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {settings.siteName || 'Indian School Muladha'}
            </motion.p>
            <div className="h-[2px] w-36 overflow-hidden rounded-full bg-black/10">
              <motion.span className="block h-full origin-left rounded-full bg-prestige-gold" style={{ scaleX }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
