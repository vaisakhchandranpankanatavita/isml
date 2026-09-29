import { useEffect, useState, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useMenus } from "@/hooks/useMenus";
import type { MenuNode } from "@/services/menus.service";
import { PUBLIC_NAV, type NavItem } from "@/config/site";
import { Button } from "@/components/common/Button";
import { ScrollTrigger } from "@/motion/gsap";

/**
 * Fixed header. Transparent over the hero, cream glass once the page has
 * scrolled, and it flips to light text while it sits over a dark section
 * (`[data-role-section="dark"]`), as on the reference site.
 */

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
    to: n.url.replace(/^\/p(?=\/)/, "") || "/",
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

function isActive(node: NavNode, pathname: string) {
  const base = node.to.split("#")[0].split("?")[0];
  if (base === "/") return pathname === "/";
  if (!base.startsWith("/")) return false;
  return pathname === base || pathname.startsWith(`${base}/`);
}

function NodeLink({
  node,
  className,
  onClick,
  children,
}: {
  node: NavNode;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  const content = children ?? node.label;
  if (isExternal(node.to)) {
    return (
      <a
        href={node.to}
        className={className}
        onClick={onClick}
        {...(node.newTab ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link to={node.to} className={className} onClick={onClick}>
      {content}
    </Link>
  );
}

/** Flattens a node's descendants into one indented list for the dropdown. */
function flatten(nodes: NavNode[], depth = 0): { node: NavNode; depth: number }[] {
  return nodes.flatMap((n) => [{ node: n, depth }, ...flatten(n.children, depth + 1)]);
}

export default function Header() {
  const { settings } = useSiteSettings();
  const { pathname } = useLocation();
  const menu = useMenus(true);
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [dark, setDark] = useState(false);

  const nodes = menu.length > 0 ? fromMenu(menu) : fromConfig(PUBLIC_NAV);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Light text while the bar overlaps a dark section.
  useEffect(() => {
    let triggers: ScrollTrigger[] = [];
    const frame = requestAnimationFrame(() => {
      const probe = 32;
      triggers = Array.from(
        document.querySelectorAll<HTMLElement>('[data-role-section="dark"]'),
      ).map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: `top ${probe}px`,
          end: `bottom ${probe}px`,
          onToggle: (self) => setDark(self.isActive),
        }),
      );
    });
    return () => {
      cancelAnimationFrame(frame);
      triggers.forEach((t) => t.kill());
      setDark(false);
    };
  }, [pathname]);

  const light = dark || open;

  return (
    <>
      <header
        className={clsx("r-header", solid && "is-solid", light && "is-dark")}
        data-header
      >
        <div className="container">
          <div className="r-header__inner">
            <Link
              to="/"
              className="flex min-h-11 items-center gap-3"
              aria-label={`${settings.siteName} home`}
              onClick={() => setOpen(false)}
            >
              <img src="/logo.png" alt="" className="h-10 w-10 object-contain" />
              <span className="hidden font-display text-xl uppercase leading-none tracking-[0.01em] sm:block">
                ISML
              </span>
            </Link>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {nodes.map((node) => {
                  const list = flatten(node.children);
                  return (
                    <li key={node.label} className="r-nav-item relative">
                      <NodeLink
                        node={node}
                        className={clsx("r-nav-link", isActive(node, pathname) && "is-active")}
                      />
                      {list.length > 0 && (
                        <div className="r-drop">
                          <div className="r-drop__panel">
                            {list.map(({ node: child, depth }) => (
                              <NodeLink
                                key={`${child.label}-${child.to}`}
                                node={child}
                                className={depth > 0 ? "r-drop__sub" : undefined}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-3">
              <Button
                as="a"
                to="/admissions#enquire"
                variant={light ? "accent" : "dark"}
                size="sm"
                className="hidden sm:inline-flex"
              >
                Enquire
              </Button>
              <button
                type="button"
                className="r-nav-link -mr-2 px-2 lg:hidden"
                aria-expanded={open}
                aria-controls="r-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? "Close" : "Menu"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div id="r-menu" className={clsx("r-menu lg:hidden", open && "is-open")} aria-hidden={!open} {...(!open ? { inert: "" as unknown as boolean } : {})}>
        {nodes.map((node, i) => (
          <div key={node.label} className="r-menu__item flex flex-col" style={{ "--i": i } as CSSProperties}>
            <NodeLink node={node} onClick={() => setOpen(false)} />
            {flatten(node.children).map(({ node: child }) => (
              <NodeLink
                key={`${child.label}-${child.to}`}
                node={child}
                className="r-menu__sub"
                onClick={() => setOpen(false)}
              />
            ))}
          </div>
        ))}
        <div className="r-menu__item mt-6" style={{ "--i": nodes.length } as CSSProperties}>
          <Button as="a" to="/admissions#enquire" variant="accent">
            Enquire about admissions
          </Button>
        </div>
      </div>
    </>
  );
}
