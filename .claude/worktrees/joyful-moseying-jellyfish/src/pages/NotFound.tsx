import { Link } from 'react-router-dom';
import ScaffoldedText from '@/components/motion/ScaffoldedText';
import { useInvertHover } from '@/hooks/useInvertHover';

/**
 * Rendered outside the public shell (router `*` and `errorElement`), so it has
 * no header, footer or layout to inherit — the ground, type and spacing are
 * all set locally here. It also sits outside `PublicLayout`, so the custom
 * cursor and Lenis smooth scroll are never mounted for this route —
 * `ScaffoldedText` and `.btn-invert` are used because both work standalone
 * (framer-motion and plain CSS/pointer events respectively); no
 * `data-cursor-magnetic` here since there's no cursor to react to it.
 */
export default function NotFound() {
  const onInvertHover = useInvertHover();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper p-6 font-sans">
      <div className="w-full max-w-measure text-center">
        <img src="/logo.png" alt="" className="mx-auto h-12 w-12" />

        <ScaffoldedText
          as="h1"
          eager
          text="We can't find that page"
          by="word"
          className="mt-8 font-display text-3xl font-bold text-ink sm:text-4xl"
        />
        <p className="mt-5 text-base leading-relaxed text-ink-soft">
          The address may have changed, or the page may have been withdrawn. The sections below
          cover most of what people come here looking for.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary btn-invert" onPointerEnter={onInvertHover}>
            Back to home
          </Link>
          <Link to="/contact" className="btn-outline btn-invert" onPointerEnter={onInvertHover}>
            Contact the school
          </Link>
        </div>

        <nav aria-label="Main sections" className="mt-12 border-t border-paper-line pt-6">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <li>
              <Link to="/about" className="link">
                About the school
              </Link>
            </li>
            <li>
              <Link to="/admissions" className="link">
                Admission
              </Link>
            </li>
            <li>
              <Link to="/news" className="link">
                News and circulars
              </Link>
            </li>
            <li>
              <Link to="/students" className="link">
                Students resources
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
