import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useMenus } from '@/hooks/useMenus';
import { useInvertHover } from '@/hooks/useInvertHover';
import type { MenuNode } from '@/services/menus.service';
import { PUBLIC_NAV, type NavItem } from '@/config/site';
import MagneticLink from '@/components/motion/MagneticLink';
import ThemeToggle from '@/components/common/ThemeToggle';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

/**
 * Floating cinematic header. Transparent over a dark hero, then resolves
 * into a permanent obsidian glass instrument once the page scrolls — the
 * bar's own identity, independent of the Studio/Cinema site theme, which
 * only ever repaints the page canvas beneath it.
 */

const EASE_BAR = 'cubic-bezier(0.645, 0.045, 0.355, 1)';
const HIDE_AFTER = 220;
const BAR_BAND = 84;

const NAV_LIST: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};
const NAV_ITEM: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

interface NavNode {
  label: string;
  to: string;
  newTab: boolean;
  children: NavNode[];
}

const isExternal = (to: string) => /^https?:\/\//.test(to);

function fromMenu(nodes: MenuNode[]): NavNode[] {
  return nodes.map((n) => ({
    label: n.label,
    to: n.url,
    newTab: n.newTab,
    children: fromMenu(n.children),
  }));
}

function fromConfig(items: NavItem[]): NavNode[] {
  return items.map((i) => ({
    label: i.label,
    to: i.to,
    newTab: false,
    children: i.children ? fromConfig(i.children) : [],
  }));
}

/** Matches `/about` for `/about` and `/about#principal`, but not `/` for everything. */
function isActive(node: NavNode, pathname: string) {
  const base = node.to.split('#')[0].split('?')[0];
  if (base === '/') return pathname === '/';
  if (!base.startsWith('/')) return false;
  return pathname === base || pathname.startsWith(`${base}/`);
}

/**
 * Tracks the two scroll states. Reads are batched into a rAF so a fast scroll
 * can't queue a layout read per event, and the bar is pinned open whenever the
 * mobile drawer is up — a menu that slides away under your thumb is a bug.
 */
function useScrollNav(pinned: boolean, pathname: string) {
  const [hidden, setHidden] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const queued = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const read = () => {
      queued.current = false;
      const y = window.scrollY;
      const down = y > lastY.current;

      setHidden(down && y > HIDE_AFTER);
      setScrolled(y > 50);

      // Is a dark ground fully underneath the bar? Measured off the elements
      // rather than compared against a scroll threshold, because the
      // hero's height (fluid — `min-h` plus however much copy the CMS holds)
      // and the footer's position are unpredictable. Checked against every
      // `[data-dark-ground]` section on the page — the hero at the top and
      // the footer at the bottom both opt in — so scrolling back up out of
      // the dark footer doesn't strand ink-coloured type on an ink ground.
      const grounds = document.querySelectorAll('[data-dark-ground]');
      const onGround = Array.from(grounds).some((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= 0 && rect.bottom >= BAR_BAND;
      });
      setOnDark(onGround);

      lastY.current = y;
    };

    const onScroll = () => {
      if (queued.current) return;
      queued.current = true;
      requestAnimationFrame(read);
    };

    // The very first measurement races the page-enter transition: `Outlet`
    // mounts inside a `motion.div` that slides up from `y: 10` (see
    // `PublicLayout`), so for the ~400ms that takes, the hero's
    // `[data-dark-ground]` rect sits a few pixels below the viewport top and
    // fails the `rect.top <= 0` check — leaving the bar in its light-page
    // colours over a dark hero until the first scroll recalculates it.
    // Retried on a few timers past that transition's duration so it settles
    // on the correct reading on its own.
    read();
    const settles = [50, 150, 300, 500, 900].map((ms) => window.setTimeout(read, ms));
    window.addEventListener('scroll', onScroll, { passive: true });
    // Resize changes the hero's height, and so which side of the bar it falls on.
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      settles.forEach(window.clearTimeout);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  return { hidden: hidden && !pinned, onDark, scrolled };
}

function NavLinkish({
  node,
  className,
  onClick,
  tabIndex,
  ariaHasPopup,
  ariaExpanded,
}: {
  node: NavNode;
  className?: string;
  onClick?: () => void;
  tabIndex?: number;
  ariaHasPopup?: boolean;
  ariaExpanded?: boolean;
}) {
  if (isExternal(node.to)) {
    return (
      <a
        href={node.to}
        className={className}
        onClick={onClick}
        tabIndex={tabIndex}
        aria-haspopup={ariaHasPopup ? 'menu' : undefined}
        aria-expanded={ariaHasPopup ? ariaExpanded : undefined}
        {...(node.newTab ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {node.label}
      </a>
    );
  }
  return (
    <Link
      to={node.to}
      className={className}
      onClick={onClick}
      tabIndex={tabIndex}
      aria-haspopup={ariaHasPopup ? 'menu' : undefined}
      aria-expanded={ariaHasPopup ? ariaExpanded : undefined}
    >
      {node.label}
    </Link>
  );
}

function TopItem({ node, pathname, dark }: { node: NavNode; pathname: string; dark: boolean }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLLIElement>(null);
  const active = isActive(node, pathname);
  const hasChildren = node.children.length > 0;

  const onBlurCapture = () => {
    window.setTimeout(() => {
      if (wrapRef.current && !wrapRef.current.contains(document.activeElement)) {
        setOpen(false);
      }
    }, 0);
  };

  return (
    <motion.li
      ref={wrapRef}
      variants={NAV_ITEM}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={onBlurCapture}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false);
      }}
    >
      <MagneticLink className={dark ? 'text-white/80' : 'text-ink'}>
        <NavLinkish
          node={node}
          ariaHasPopup={hasChildren}
          ariaExpanded={hasChildren ? open : undefined}
          className={clsx(
            'inline-flex items-center gap-1 px-3 py-2 text-2xs font-semibold uppercase tracking-widest transition-colors',
            dark
              ? active
                ? 'text-white'
                : 'text-white/70 hover:text-white'
              : active
                ? 'text-brand-700'
                : 'text-ink hover:text-brand-700',
          )}
        />
      </MagneticLink>
      {hasChildren && (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute left-0 top-full z-30 w-[16rem] border border-white/10 bg-neutral-950/70 p-1.5 shadow-lift backdrop-blur-xl"
            >
              <ul className="space-y-1">
                {node.children.map((child) => (
                  <li key={`${child.label}-${child.to}`}>
                    <NavLinkish
                      node={child}
                      className="block px-3.5 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                      onClick={() => setOpen(false)}
                    />
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.li>
  );
}

function MobileItem({
  node,
  onNavigate,
  tabbable,
}: {
  node: NavNode;
  onNavigate: () => void;
  tabbable: boolean;
}) {
  const [open, setOpen] = useState(false);
  const itemTabIndex = tabbable ? undefined : -1;
  return (
    <li className="group">
      <div className="flex items-center justify-between">
        <NavLinkish
          node={node}
          className="flex-1 py-2.5 text-base font-semibold text-ink group-hover:text-brand-700 transition-colors"
          onClick={onNavigate}
          tabIndex={itemTabIndex}
        />
        {node.children.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={`${open ? 'Hide' : 'Show'} ${node.label} pages`}
            tabIndex={itemTabIndex}
            className="p-2 text-ink-muted hover:text-brand-700"
          >
            <svg
              viewBox="0 0 20 20"
              className={clsx('h-4 w-4 transition-transform', open && 'rotate-180')}
              fill="currentColor"
            >
              <path d="M5.5 7.5 10 12l4.5-4.5z" />
            </svg>
          </button>
        )}
      </div>
      {open && node.children.length > 0 && (
        <ul className="pb-2 pl-3">
          {node.children.map((child) => (
            <li key={`${child.label}-${child.to}`}>
              <NavLinkish
                node={child}
                className="block py-1.5 text-sm text-ink-soft hover:text-brand-700"
                onClick={onNavigate}
                tabIndex={itemTabIndex}
              />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/** The one call to action in the bar: no fill, no box — a hairline that
 * lives as an inset glow rather than a border, so it reads as light rather
 * than as chrome. Widens its glow on hover/focus instead of changing shape. */
function HeaderCTA({ dark }: { dark: boolean }) {
  const onInvertHover = useInvertHover();
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={clsx(
        'relative isolate hidden sm:inline-flex',
        dark
          ? 'shadow-[inset_0_0_0_1px_rgba(255,192,182,0.4)] hover:shadow-[inset_0_0_0_1px_rgba(255,211,203,0.7),0_0_20px_-4px_rgba(255,183,178,0.75)] focus-within:shadow-[inset_0_0_0_1px_rgba(255,211,203,0.85),0_0_24px_-2px_rgba(255,183,178,0.9)]'
          : 'shadow-[inset_0_0_0_1px_rgba(193,79,68,0.4)] hover:shadow-[inset_0_0_0_1px_rgba(156,60,51,0.65),0_0_16px_-4px_rgba(193,79,68,0.5)] focus-within:shadow-[inset_0_0_0_1px_rgba(156,60,51,0.8)]',
        'transition-shadow duration-300',
      )}
    >
      <Link
        to="/admissions"
        onPointerEnter={onInvertHover}
        className={clsx(
          'px-5 py-2 text-2xs font-semibold uppercase tracking-widest transition-colors duration-300 focus:outline-none',
          dark ? 'text-white' : 'text-brand-700',
        )}
      >
        Admissions Portal
      </Link>
    </motion.div>
  );
}

export default function Header() {
  const { settings } = useSiteSettings();
  const cmsMenu = useMenus(true);
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { hidden, onDark: overDarkHero, scrolled } = useScrollNav(mobileOpen, pathname);

  const onDark = overDarkHero && !mobileOpen;
  // Once the bar itself has gone to obsidian glass, its type reads light
  // regardless of what's under it — only the transparent, pre-scroll state
  // still depends on whether it's floating over a dark hero or a light page.
  const dark = onDark || (scrolled && !mobileOpen);
  const nav = cmsMenu.length > 0 ? fromMenu(cmsMenu) : fromConfig(PUBLIC_NAV);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header className="pointer-events-none fixed inset-x-4 top-4 z-50 sm:inset-x-6 lg:inset-x-8">
      <div
        className="pointer-events-auto relative"
        style={{
          transform: hidden ? 'translate3d(0, calc(-100% - 1rem), 0)' : 'translate3d(0,0,0)',
          transition: `transform 500ms ${EASE_BAR}`,
          willChange: 'transform',
        }}
      >
        <div
          className={clsx(
            'relative z-10 flex items-center justify-between gap-4 px-3 py-2.5 sm:px-4 transition-all duration-500',
            scrolled
              ? 'border border-white/10 bg-neutral-950/40 py-2 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.65)]'
              : onDark
                ? 'bg-gradient-to-b from-black/45 via-black/15 to-transparent py-2.5'
                : 'bg-transparent py-2.5',
          )}
        >
          {/* Radial light flare — a fixed decorative gradient, not a
              hover-tracked one, so it doesn't compete with the cursor's own
              ring. Its opacity is the "third dimension" cue: faint while the
              bar is transparent over the hero, fuller once the glass forms. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(140% 120% at 15% 0%, rgba(193,79,68,0.35), transparent 55%)',
            }}
            animate={{ opacity: scrolled ? 0.55 : onDark ? 0.25 : 0.1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          <Link to="/" className="flex items-center gap-2.5" aria-label={settings.siteName}>
            <img src="/logo.png" alt="" className="h-9 w-9 shrink-0" />
            <span className="leading-tight">
              <span
                className={clsx(
                  'block font-display text-lg font-semibold tracking-tight transition-colors',
                  dark ? 'text-white' : 'text-ink',
                )}
              >
                {settings.siteName}
              </span>
              <span
                className={clsx(
                  'hidden text-2xs uppercase tracking-[0.2em] transition-colors sm:block',
                  dark ? 'text-white/60' : 'text-ink-muted',
                )}
              >
                {settings.tagline}
              </span>
            </span>
          </Link>

          <motion.nav
            aria-label="Main"
            className="hidden lg:block"
            initial="hidden"
            animate="visible"
            variants={NAV_LIST}
          >
            <ul className="flex items-center gap-1">
              {nav.map((node) => (
                <TopItem key={`${node.label}-${node.to}`} node={node} pathname={pathname} dark={dark} />
              ))}
            </ul>
          </motion.nav>

          <div className="relative z-10 flex items-center gap-3">
            <ThemeToggle onDark={dark} className="hidden lg:inline-flex" />
            <HeaderCTA dark={dark} />

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className={clsx(
                'relative flex h-9 w-9 shrink-0 items-center justify-center border transition-colors lg:hidden',
                dark
                  ? 'border-white/25 text-white hover:border-white/50'
                  : 'border-ink/25 text-ink hover:border-ink/50',
              )}
            >
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 h-px w-4 bg-current transition-transform duration-200"
                style={{
                  transform: mobileOpen
                    ? 'translate(-50%, -50%) rotate(45deg)'
                    : 'translate(-50%, calc(-50% - 3px))',
                }}
              />
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 h-px w-4 bg-current transition-transform duration-200"
                style={{
                  transform: mobileOpen
                    ? 'translate(-50%, -50%) rotate(-45deg)'
                    : 'translate(-50%, calc(-50% + 3px))',
                }}
              />
            </button>
          </div>
        </div>

        <div
          id="mobile-nav"
          aria-hidden={!mobileOpen}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setMobileOpen(false);
          }}
          className={clsx(
            'absolute right-0 top-[calc(100%+0.75rem)] z-20 w-full max-w-[24rem] overflow-hidden bg-white shadow-lift transition-opacity lg:hidden',
            mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          <div className="px-6 pb-6 pt-5">
            <div className="flex justify-end pb-4">
              <ThemeToggle onDark={false} />
            </div>
            <ul className="divide-y divide-paper-line">
              {nav.map((node) => (
                <MobileItem
                  key={`${node.label}-${node.to}`}
                  node={node}
                  onNavigate={() => setMobileOpen(false)}
                  tabbable={mobileOpen}
                />
              ))}
            </ul>
            <Link
              to="/admissions"
              onClick={() => setMobileOpen(false)}
              className="mt-5 flex w-full items-center justify-center border border-brand-600/50 px-5 py-2.5 text-2xs font-semibold uppercase tracking-widest text-brand-700 shadow-[inset_0_0_0_1px_rgba(193,79,68,0.4)] transition-shadow duration-300 hover:shadow-[inset_0_0_0_1px_rgba(156,60,51,0.65)]"
            >
              Admissions Portal
            </Link>
          </div>
        </div>

        <div
          aria-hidden
          onClick={() => setMobileOpen(false)}
          className={clsx(
            'fixed inset-0 -z-10 bg-paper/80 transition-opacity lg:hidden',
            mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
          )}
        />
      </div>
    </header>
  );
}
