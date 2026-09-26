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
 * Neo-Academy Terminal two-tier header: a slim ink utility strip (admissions
 * announcement + affiliation/contact links) sitting above a permanent,
 * sharp-edged console bar. It never turns transparent — a school's masthead
 * reads the same over every page and every hero image.
 */

const EASE_BAR = 'cubic-bezier(0.645, 0.045, 0.355, 1)';
const HIDE_AFTER = 220;

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
 * Tracks scroll for the hide-on-scroll-down behaviour and the "has the page
 * scrolled at all" shadow state. Reads are batched into a rAF so a fast
 * scroll can't queue a layout read per event, and the bar is pinned open
 * whenever the mobile drawer is up — a menu that slides away under your
 * thumb is a bug.
 */
function useScrollNav(pinned: boolean, pathname: string) {
  const [hidden, setHidden] = useState(false);
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
      setScrolled(y > 20);

      lastY.current = y;
    };

    const onScroll = () => {
      if (queued.current) return;
      queued.current = true;
      requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  return { hidden: hidden && !pinned, scrolled };
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

function TopItem({ node, pathname }: { node: NavNode; pathname: string }) {
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
      <MagneticLink className="text-ink">
        <NavLinkish
          node={node}
          ariaHasPopup={hasChildren}
          ariaExpanded={hasChildren ? open : undefined}
          className={clsx(
            'inline-flex items-center gap-1 px-3 py-2 text-2xs font-semibold uppercase tracking-widest transition-colors',
            active ? 'text-marigold-500' : 'text-ink hover:text-marigold-500',
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
              className="absolute left-0 top-full z-30 w-[16rem] border border-paper-line bg-paper-light p-1.5 shadow-lift"
            >
              <ul className="space-y-1">
                {node.children.map((child) => (
                  <li key={`${child.label}-${child.to}`}>
                    <NavLinkish
                      node={child}
                      className="block px-3.5 py-2.5 text-sm text-ink-soft transition-colors hover:bg-paper-sunk hover:text-marigold-500"
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
          className="flex-1 py-2.5 text-base font-semibold text-ink group-hover:text-marigold-500 transition-colors"
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
            className="p-2 text-ink-muted hover:text-marigold-500"
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
                className="block py-1.5 text-sm text-ink-soft hover:text-marigold-500"
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

/** The one interaction trigger in the bar carrying the neon accent — a
 * hairline terminal button, marigold border and label, filling faintly on
 * hover/focus. No solid fill at rest, matching the site's one-button
 * language. */
function HeaderCTA() {
  const onInvertHover = useInvertHover();
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="hidden sm:inline-flex"
    >
      <Link
        to="/admissions"
        onPointerEnter={onInvertHover}
        className="border border-marigold-500/70 bg-marigold-500/5 px-5 py-2.5 text-2xs font-semibold uppercase tracking-widest text-marigold-500 transition-colors duration-300 hover:bg-marigold-500/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-marigold-500"
      >
        Apply for Admission
      </Link>
    </motion.div>
  );
}

/** Slim ink strip above the main nav: an admissions announcement on the
 * left, affiliation/contact links on the right — the two lines a school's
 * masthead always carries. Scrolls away with the rest of the bar. */
function TopBar() {
  return (
    <div className="hidden border-b border-paper-line bg-obsidian text-ink-muted sm:block">
      <div className="container flex items-center justify-between gap-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]">
        <p className="truncate normal-case tracking-normal font-sans">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-marigold-500">
            Admissions Open 2026-27
          </span>
          <span className="mx-2 text-ink-faint">/</span>
          Nurturing young minds for a brighter tomorrow
        </p>
        <div className="flex shrink-0 items-center gap-4">
          <span>CBSE</span>
          <span className="hidden text-ink-faint md:inline">/</span>
          <span className="hidden md:inline">AFFIL. NO. 930076</span>
          <span className="text-ink-faint">/</span>
          <Link to="/contact" className="hover:text-marigold-500">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const { settings } = useSiteSettings();
  const cmsMenu = useMenus(true);
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { hidden, scrolled } = useScrollNav(mobileOpen, pathname);
  const nav = cmsMenu.length > 0 ? fromMenu(cmsMenu) : fromConfig(PUBLIC_NAV);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className="relative"
        style={{
          transform: hidden ? 'translate3d(0, -100%, 0)' : 'translate3d(0,0,0)',
          transition: `transform 500ms ${EASE_BAR}`,
          willChange: 'transform',
        }}
      >
        <TopBar />

        <div
          className={clsx(
            'relative z-10 border-b border-paper-line bg-paper-light transition-shadow duration-300',
            scrolled && 'shadow-[0_1px_0_var(--paper-line)]',
          )}
        >
          <div className="container flex items-center justify-between gap-4 py-2.5">
            <Link to="/" className="flex items-center gap-2.5" aria-label={settings.siteName}>
              <img src="/logo.png" alt="" className="h-10 w-10 shrink-0" />
              <span className="leading-tight">
                <span className="block font-display text-lg font-semibold tracking-tight text-ink">
                  {settings.siteName}
                </span>
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint sm:block">
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
                  <TopItem key={`${node.label}-${node.to}`} node={node} pathname={pathname} />
                ))}
              </ul>
            </motion.nav>

            <div className="relative z-10 flex items-center gap-3">
              <ThemeToggle onDark={false} className="hidden lg:inline-flex" />
              <HeaderCTA />

              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                className="relative flex h-9 w-9 shrink-0 items-center justify-center border border-ink/25 text-ink transition-colors hover:border-ink/50 lg:hidden"
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
        </div>

        <div
          id="mobile-nav"
          aria-hidden={!mobileOpen}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setMobileOpen(false);
          }}
          className={clsx(
            'absolute right-0 top-full z-20 w-full max-w-[24rem] overflow-hidden border-l border-paper-line bg-paper-light shadow-lift transition-opacity lg:hidden',
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
              className="mt-5 flex w-full items-center justify-center border border-marigold-500/70 bg-marigold-500/5 px-5 py-2.5 text-2xs font-semibold uppercase tracking-widest text-marigold-500 hover:bg-marigold-500/15"
            >
              Apply for Admission
            </Link>
          </div>
        </div>

        <div
          aria-hidden
          onClick={() => setMobileOpen(false)}
          className={clsx(
            'fixed inset-0 -z-10 bg-black/60 transition-opacity lg:hidden',
            mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
          )}
        />
      </div>
    </header>
  );
}
