import { Link } from 'react-router-dom';

/** Rendered outside the public shell (router `*` and `errorElement`), so it sets its own ground and type. */
export default function NotFound() {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper p-6 font-sans">
      <div className="w-full max-w-measure text-center">
        <img src="/logo.png" alt="" className="mx-auto h-12 w-12" />

        <h1 className="mt-8 t-h1 text-ink">We can't find that page</h1>
        <p className="mt-5 text-base leading-relaxed text-ink-soft">
          The address may have changed, or the page may have been withdrawn. The sections below
          cover most of what people come here looking for.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">
            Back to home
          </Link>
          <Link to="/contact" className="btn-outline">
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
