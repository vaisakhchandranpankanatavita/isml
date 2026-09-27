import { Link, useLocation } from "react-router-dom";
import ScaffoldedText from "@/components/motion/ScaffoldedText";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  /** Short label set into the rule above the title. */
  eyebrow?: string;
  crumb?: string;
}

function toCrumb(pathname: string): string {
  const seg = pathname.split("/").filter(Boolean)[0];
  if (!seg) return "Home";
  return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Inner-page masthead, modelled on the VCASS PageHeader: clears the floating
 * nav, then a condensed breadcrumb, a very large headline revealed word by
 * word, an optional serif-italic eyebrow line and a condensed lead.
 */
export default function PageHero({
  title,
  subtitle,
  eyebrow,
  crumb,
}: PageHeroProps) {
  const { pathname } = useLocation();
  const breadcrumb = crumb ?? toCrumb(pathname);

  return (
    <header className="border-b border-paper-line bg-paper">
      <div className="container pb-[clamp(2.5rem,2.1516rem+1.4907vw,4rem)] pt-[calc(var(--vc-nav-top)+var(--vc-nav-height)+clamp(2.5rem,2.1516rem+1.4907vw,4rem))]">
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
        <ScaffoldedText
          as="h1"
          eager
          text={title}
          by="word"
          className="mt-6 max-w-[18ch] text-[clamp(2rem,3.5vw,4rem)] leading-[0.92] tracking-[-0.025em] text-ink"
        />

        {eyebrow && (
          <p className="vc-serif mt-4 text-xl text-school-red md:text-2xl">
            {eyebrow}
          </p>
        )}

        {subtitle && (
          <p className="mt-4 max-w-[56ch] font-display text-lg font-semibold leading-[1.25] tracking-[-0.01em] text-ink-soft md:text-xl">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
