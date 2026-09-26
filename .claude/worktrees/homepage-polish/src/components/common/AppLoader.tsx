import { useEffect, useState } from 'react';
import { animate, AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import './app-loader.css';

/**
 * First-load splash — minimal, shown once per hard page load (it lives above
 * the router in `main.tsx`, so client-side navigation never re-triggers it).
 * Logo, a thin progress line, plain fade out. Waits for web fonts so the page
 * never reveals in a fallback face.
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
          className="ld"
          role="status"
          aria-label="Loading"
          exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeInOut' } }}
        >
          <div className="ld__glow" aria-hidden />

          <div className="ld__skeleton" aria-hidden>
            <div className="ld__skel-bar ld__skel-bar--nav" />
            <div className="ld__skel-bar ld__skel-bar--hero" />
            <div className="ld__skel-row">
              <div className="ld__skel-bar ld__skel-bar--card" />
              <div className="ld__skel-bar ld__skel-bar--card" />
              <div className="ld__skel-bar ld__skel-bar--card" />
            </div>
          </div>

          <img src="/logo.png" alt="" className="ld__logo" />

          <motion.p
            className="ld__name"
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
          >
            {settings.siteName || 'Indian School Muladha'}
          </motion.p>

          <div className="ld__bar">
            <motion.span style={{ scaleX }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
