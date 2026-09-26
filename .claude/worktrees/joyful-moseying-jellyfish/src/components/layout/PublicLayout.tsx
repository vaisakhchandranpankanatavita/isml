import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import CustomCursor from '@/components/common/CustomCursor';
import SmoothScroll from '@/components/common/SmoothScroll';
import SpotlightTracker from '@/components/common/SpotlightTracker';

/**
 * Public shell.
 *
 * Deliberately plain: a floating header, content in normal flow, a footer. The
 * header is `fixed`, so it takes up no space in flow — consuming pages/components
 * are responsible for their own top padding to clear it (as PageHero already
 * does), and `scroll-padding-top` in index.css is what keeps in-page anchors
 * clear of it.
 *
 * The admin CMS mounts outside this shell and shares the same design system:
 * `.card`, `.field-input` and the button set are common to both.
 */
export default function PublicLayout() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen flex-col bg-paper">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]
                     focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm
                     focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>

        <CustomCursor />
        <SpotlightTracker />
        <Header />

        <main id="main" className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}
