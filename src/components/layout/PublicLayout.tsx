import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import CustomCursor from '@/components/common/CustomCursor';
import SmoothScroll from '@/components/common/SmoothScroll';
import SpotlightTracker from '@/components/common/SpotlightTracker';

/**
 * The VCASS route curtain: a near-black sheet carrying the crest covers the
 * page as each route mounts, then wipes off upward. Its clip closes from the
 * bottom while it drifts up 10% over 0.6s, the same values the reference
 * site's `background-anim` uses. The first route of a hard load is skipped,
 * because AppLoader's curtain already covers it.
 */
let firstRoute = true;

function RouteCurtain() {
  const reduce = useReducedMotion();
  const [skip] = useState(() => {
    const was = firstRoute;
    firstRoute = false;
    return was;
  });
  if (reduce || skip) return null;
  return (
    <motion.div
      aria-hidden
      className="vc-curtain"
      initial={{ clipPath: 'inset(0% 0% 0% 0%)', y: '0%' }}
      animate={{ clipPath: 'inset(0% 0% 90% 0%)', y: '-10%', transitionEnd: { display: 'none' } }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
    >
      <motion.img
        src="/logo.png"
        alt=""
        className="w-24 md:w-32"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </motion.div>
  );
}

/**
 * Public shell: floating header, content in normal flow, footer. The header
 * is `fixed`, so pages are responsible for their own top padding to clear
 * it (PageHero does), and `scroll-padding-top` in index.css keeps in-page
 * anchors clear of it.
 */
export default function PublicLayout() {
  const { pathname } = useLocation();

  return (
    <SmoothScroll>
      <div className="flex min-h-screen flex-col bg-paper">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]
                     focus:rounded-full focus:bg-neutral-1 focus:px-5 focus:py-2.5 focus:font-display
                     focus:text-sm focus:font-bold focus:uppercase focus:text-neutral-7"
        >
          Skip to content
        </a>

        <CustomCursor />
        <SpotlightTracker />
        <Header />

        <main id="main" className="flex-1">
          <div key={pathname}>
            <RouteCurtain />
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}
