import { Link, useLocation } from 'react-router-dom';
import ScaffoldedText from '@/components/motion/ScaffoldedText';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  /** Short label set into the rule above the title. */
  eyebrow?: string;
  crumb?: string;
}

function toCrumb(pathname: string): string {
  const seg = pathname.split('/').filter(Boolean)[0];
  if (!seg) return 'Home';
  return seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Inner-page masthead, modelled on the VCASS PageHeader: clears the floating
 * nav, then a condensed breadcrumb, a very large headline revealed word by
 * word, an optional serif-italic eyebrow line and a condensed lead.
 */
export default function PageHero({ title, subtitle, eyebrow, crumb }: PageHeroProps) {
  const { pathname } = useLocation();
  const breadcrumb = crumb ?? toCrumb(pathname);

  return (
    <header className="border-b border-paper-line bg-paper">
      <div className="container pb-[clamp(3.5rem,2.9193rem+2.4845vw,6rem)] pt-[calc(var(--vc-nav-top)+var(--vc-nav-height)+clamp(3.5rem,2.9193rem+2.4845vw,6rem))]">
        <nav aria-label="Breadcrumb" className="vc-label text-xs text-ink-muted">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="hover:text-[#f59021]">
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
          className="mt-8 max-w-[16ch] text-[clamp(2.8414rem,1.338rem+6.4316vw,9.3132rem)] leading-[0.8] tracking-[-0.03em] text-ink"
        />

        {eyebrow && <p className="vc-serif mt-6 text-2xl text-[#f59021] md:text-4xl">{eyebrow}</p>}

        {subtitle && (
          <p className="mt-6 max-w-[52ch] font-display text-xl font-semibold leading-[1.1] tracking-[-0.02em] text-ink-soft md:text-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
