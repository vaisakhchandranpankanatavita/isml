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
 * Page masthead.
 *
 * Sits on the sandstone band so every inner page opens with a clear
 * separation from the white content column below it, and carries a real
 * breadcrumb — on an institution's site, "where am I in the hierarchy" is a
 * question people genuinely have.
 */
export default function PageHero({ title, subtitle, eyebrow, crumb }: PageHeroProps) {
  const { pathname } = useLocation();
  const breadcrumb = crumb ?? toCrumb(pathname);

  return (
    <header className="band border-b border-paper-line">
      {/* Top padding clears the floating header, which is fixed and so takes
          up no space of its own. */}
      <div className="container pb-12 pt-28 md:pb-16 md:pt-32">
        <nav aria-label="Breadcrumb" className="text-xs text-ink-muted">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="hover:text-brand-700">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-ink-faint">
              /
            </li>
            <li className="font-semibold text-ink-soft" aria-current="page">
              {breadcrumb}
            </li>
          </ol>
        </nav>

        {eyebrow && <p className="rule-label mt-8">{eyebrow}</p>}

        {/* `eager`, not scroll-triggered — this masthead is above the fold
            on every inner page, the same as the Hero headline. */}
        <ScaffoldedText
          as="h1"
          eager
          text={title}
          by="word"
          className="mt-5 max-w-4xl text-3xl font-bold leading-[1.12] md:text-4xl lg:text-5xl"
        />

        {subtitle && (
          <p className="mt-5 max-w-measure text-base leading-relaxed text-ink-soft md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
