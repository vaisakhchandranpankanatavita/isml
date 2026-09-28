import { Link, useLocation } from "react-router-dom";
import ScaffoldedText from "@/components/motion/ScaffoldedText";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  /** Short label set into the rule above the title. */
  eyebrow?: string;
  crumb?: string;
  /** Keep the h1 for screen readers only and run the subtitle on one line —
   *  for pages whose breadcrumb already names them. */
  hideTitle?: boolean;
}

function toCrumb(pathname: string): string {
  // `/p/<slug>` is the legacy prefix for CMS pages; the crumb is the page,
  // never the "p".
  const segs = pathname.split("/").filter(Boolean);
  const seg = segs[0] === "p" ? segs[1] : segs[0];
  if (!seg) return "Home";
  return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Compact inner-page masthead: clears the floating nav, then a breadcrumb,
 * headline, optional eyebrow and lead.
 */
export default function PageHero({
  title,
  subtitle,
  eyebrow,
  crumb,
  hideTitle,
}: PageHeroProps) {
  const { pathname } = useLocation();
  const breadcrumb = crumb ?? toCrumb(pathname);

  return (
    <header className="border-b border-paper-line bg-paper">
      <div className="container pb-3 pt-[calc(var(--vc-nav-top)+var(--vc-nav-height)+0.75rem)]">
        <nav
          aria-label="Breadcrumb"
          className="vc-label text-xs text-ink-muted"
        >
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="hover:text-school-red">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-ink-faint">
              /
            </li>
            <li className="text-ink-soft" aria-current="page">
              {breadcrumb}
            </li>
          </ol>
        </nav>

        {/* `eager`, not scroll-triggered — this masthead is above the fold
            on every inner page, the same as the Hero headline. */}
        {hideTitle ? (
          <h1 className="sr-only">{title}</h1>
        ) : (
          <ScaffoldedText
            as="h1"
            eager
            text={title}
            by="word"
            className="mt-2 max-w-[24ch] text-[clamp(1.5rem,2vw,2rem)] leading-[1.05] tracking-[-0.02em] text-ink"
          />
        )}

        {eyebrow && (
          <p className="vc-serif mt-2 text-base text-school-red md:text-lg">
            {eyebrow}
          </p>
        )}

        {subtitle && (
          <p
            className={
              hideTitle
                ? // Sized off the viewport so the sentence fits one line from lg up.
                  "mt-2 font-display text-sm font-semibold leading-[1.35] tracking-[-0.01em] text-ink-soft lg:truncate lg:text-[clamp(0.8rem,1.1vw,1rem)]"
                : "mt-2 max-w-[56ch] font-display text-sm font-semibold leading-[1.4] tracking-[-0.01em] text-ink-soft md:text-base"
            }
          >
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
