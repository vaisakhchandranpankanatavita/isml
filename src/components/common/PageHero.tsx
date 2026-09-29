import { Link, useLocation } from "react-router-dom";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  /** Short label set above the title. */
  eyebrow?: string;
  crumb?: string;
  /** Keep the h1 for screen readers only, for pages whose breadcrumb already names them. */
  hideTitle?: boolean;
}

function toCrumb(pathname: string): string {
  const segs = pathname.split("/").filter(Boolean);
  const seg = segs[0] === "p" ? segs[1] : segs[0];
  if (!seg) return "Home";
  return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Inner-page masthead: a big Anton headline with the per-letter blur-in. */
export default function PageHero({ title, subtitle, eyebrow, crumb, hideTitle }: PageHeroProps) {
  const { pathname } = useLocation();
  const breadcrumb = crumb ?? toCrumb(pathname);

  return (
    <header className="bg-paper">
      <div className="container pb-8 pt-[calc(var(--vc-nav-top)+var(--vc-nav-height)+2rem)] md:pt-[calc(var(--vc-nav-top)+var(--vc-nav-height)+3rem)] md:pb-12">
        <nav aria-label="Breadcrumb" className="vc-label text-ink-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-ink" aria-current="page">
              {breadcrumb}
            </li>
          </ol>
        </nav>

        {hideTitle ? (
          <h1 className="sr-only">{title}</h1>
        ) : (
          <h1
            data-r="chars"
            data-delay="0.1"
            className="mt-6 max-w-[16ch] t-h1 break-words text-ink"
          >
            {title}
          </h1>
        )}

        {eyebrow && (
          <p data-r="fade-up" className="mt-4 text-lg font-semibold text-signal-deep md:text-xl">
            {eyebrow}
          </p>
        )}

        {subtitle && (
          <p data-r="fade-up" data-delay="0.5" className="mt-4 max-w-[56ch] text-lg font-medium leading-snug text-ink-soft md:text-xl">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
