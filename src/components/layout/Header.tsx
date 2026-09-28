import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useMenus } from '@/hooks/useMenus';
import type { MenuNode } from '@/services/menus.service';
import { PUBLIC_NAV, type NavItem } from '@/config/site';
import ThemeToggle from '@/components/common/ThemeToggle';
import { Button } from '@/components/common/Button';

/**
 * Floating navigation bar, modelled on the VCASS header.
 *
 * A translucent, blurred glass bar with dark text floats a fixed distance
 * below the top of the viewport. It spans the page gutter at rest; once the page
 * has scrolled past 100px it eases inward (`.vc-nav` width, 0.6s ease-in-out
 * — see index.css) and the utility controls on the right fade away, leaving
 * logo, menu and the call to action. It never hides.
 *
 * Dropdowns are the VCASS "Submenu": a pale rounded panel that springs up
 * from 90px below with a 15° tilt on a bounce curve, with the label growing
 * on hover. A third menu level (e.g. Board Of Directors → BOD Guidelines) is listed
 * indented under its parent row rather than opening a second flyout.
 */

const SCROLL_THRESHOLD = 100;

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
    to: n.url.replace(/^\/p(?=\/)/, '') || '/',
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

/** VCASS toggles `.scrolled` past 100px, batched into a rAF. */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let queued = false;
    const read = () => {
      queued = false;
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrolled;
}

function NavLinkish({
  node,
  className,
  onClick,
  tabIndex,
  ariaHasPopup,
  ariaExpanded,
  children,
}: {
  node: NavNode;
  className?: string;
  onClick?: () => void;
  tabIndex?: number;
  ariaHasPopup?: boolean;
  ariaExpanded?: boolean;
  children?: React.ReactNode;
}) {
  const content = children ?? node.label;
  const aria = {
    'aria-haspopup': ariaHasPopup ? ('menu' as const) : undefined,
    'aria-expanded': ariaHasPopup ? ariaExpanded : undefined,
  };
  if (isExternal(node.to)) {
    return (
      <a
        href={node.to}
        className={className}
        onClick={onClick}
        tabIndex={tabIndex}
        {...aria}
        {...(node.newTab ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link to={node.to} className={className} onClick={onClick} tabIndex={tabIndex} {...aria}>
      {content}
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
    <li
      ref={wrapRef}
      className={clsx('vc-menu-item', open && 'is-open')}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={onBlurCapture}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false);
      }}
    >
      <NavLinkish
        node={node}
        ariaHasPopup={hasChildren}
        ariaExpanded={hasChildren ? open : undefined}
        className={clsx('vc-menu-link vc-label', active && 'is-active')}
      />
      {hasChildren && (
        <div className="vc-submenu" data-lenis-prevent>
          <ul className="vc-submenu__list">
            {node.children.map((child) => (
              <li key={`${child.label}-${child.to}`} className="vc-submenu__item vc-hover-parent">
                <NavLinkish node={child} className="vc-submenu__link" onClick={() => setOpen(false)}>
                  <span className="vc-submenu__heading vc-label-l">
                    {child.label}
                    <span aria-hidden>{child.label}</span>
                  </span>
                  <span aria-hidden className="vc-submenu__arrow vc-btn vc-btn--sm vc-btn--primary !p-0">
                    <span className="vc-btn__icon">
                      <span className="vc-btn__glyph" />
                    </span>
                  </span>
                </NavLinkish>
                {child.children.length > 0 && (
                  <ul className="vc-submenu__sub">
                    {child.children.map((grand) => (
                      <li key={`${grand.label}-${grand.to}`}>
                        <NavLinkish
                          node={grand}
                          className="vc-submenu__sub-link"
                          onClick={() => setOpen(false)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
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
    <li className="mobile-nav-item border-b border-neutral-6">
      <div className="flex items-center gap-2.5 py-1.5">
        <NavLinkish
          node={node}
          className="flex-1 font-sans text-base font-medium leading-tight text-neutral-2 transition-colors hover:text-school-red"
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
            className="vc-icon-btn h-8 w-8 [--btn-bg:#f1f2f4] [--btn-fg:#1f1e1d]"
          >
            <svg
              viewBox="0 0 20 20"
              className={clsx('h-3.5 w-3.5 transition-transform duration-300', open && 'rotate-45')}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M10 4v12M4 10h12" />
            </svg>
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {open && node.children.length > 0 && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden pl-9"
          >
            {node.children.map((child) => (
              <li key={`${child.label}-${child.to}`}>
                <NavLinkish
                  node={child}
                  className="block py-1.5 font-sans text-sm font-normal text-neutral-4 transition-colors hover:text-neutral-1"
                  onClick={onNavigate}
                  tabIndex={itemTabIndex}
                />
                {child.children.length > 0 && (
                  <ul className="mb-1 border-l border-neutral-6 pl-3">
                    {child.children.map((grand) => (
                      <li key={`${grand.label}-${grand.to}`}>
                        <NavLinkish
                          node={grand}
                          className="block py-1 font-sans text-xs font-normal text-neutral-4 transition-colors hover:text-neutral-1"
                          onClick={onNavigate}
                          tabIndex={itemTabIndex}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="h-2" />
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function Header() {
  const { settings } = useSiteSettings();
  const cmsMenu = useMenus(true);
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrolled();
  const nav = cmsMenu.length > 0 ? fromMenu(cmsMenu) : fromConfig(PUBLIC_NAV);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle('vc-menu-open', mobileOpen);
    return () => document.documentElement.classList.remove('vc-menu-open');
  }, [mobileOpen]);

  return (
    <header className={clsx('vc-nav-container', scrolled && !mobileOpen && 'is-scrolled')}>
      <nav aria-label="Main" className="vc-nav">
        <Link
          to="/"
          className="flex h-full min-w-0 flex-1 items-center gap-2 text-neutral-1 sm:gap-3 lg:flex-none"
          aria-label={settings.siteName}
        >
          <img src="/logo.png" alt="" className="h-8 w-8 shrink-0 sm:h-9 sm:w-9 xl:h-10 xl:w-10" />
          <span className="vc-nav__brand-name block min-w-0 flex-1 truncate whitespace-nowrap font-sans text-sm font-semibold uppercase leading-none tracking-wide sm:text-lg lg:flex-none lg:text-sm xl:text-base 2xl:text-lg">
            {settings.siteName}
          </span>
        </Link>

        <ul className="vc-menu hidden lg:flex">
          {nav.map((node) => (
            <TopItem key={`${node.label}-${node.to}`} node={node} pathname={pathname} />
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <div className="vc-nav-utility hidden lg:flex">
            <ThemeToggle />
          </div>
          <Button variant="accent" size="sm" as="a" to="/admissions" className="hidden sm:inline-flex">
            Admissions
          </Button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="vc-icon-btn lg:hidden"
          >
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[2px] w-4 rounded-full bg-current transition-transform duration-300"
              style={{
                transform: mobileOpen
                  ? 'translate(-50%, -50%) rotate(45deg)'
                  : 'translate(-50%, calc(-50% - 3px))',
              }}
            />
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[2px] w-4 rounded-full bg-current transition-transform duration-300"
              style={{
                transform: mobileOpen
                  ? 'translate(-50%, -50%) rotate(-45deg)'
                  : 'translate(-50%, calc(-50% + 3px))',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Compact navigation dropdown, anchored directly below the mobile bar. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.985 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setMobileOpen(false);
            }}
            className="mobile-nav-panel pointer-events-auto mt-2 w-full overflow-y-auto rounded-xl bg-neutral-7 px-3.5 pb-3 pt-2 sm:max-w-[26rem] sm:self-end sm:px-4 lg:hidden"
            data-lenis-prevent
          >
            <ul>
              {nav.map((node) => (
                <MobileItem
                  key={`${node.label}-${node.to}`}
                  node={node}
                  onNavigate={() => setMobileOpen(false)}
                  tabbable={mobileOpen}
                />
              ))}
            </ul>
            <div className="mt-2 flex items-center justify-between gap-3 border-t border-neutral-6 pt-2">
              <Button variant="accent" size="sm" as="a" to="/admissions" onClick={() => setMobileOpen(false)}>
                Admissions portal
              </Button>
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
