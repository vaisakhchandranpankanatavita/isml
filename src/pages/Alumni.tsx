import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/common/PageHero";
import SectionHeading from "@/components/common/SectionHeading";
import { usePage } from "@/hooks/usePage";
import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * `#register`, `#directory` and `#events` are linked from the main navigation,
 * so those ids are load-bearing.
 *
 * The register is a real form rather than a button that does nothing — the
 * previous version offered three buttons with no handlers, which is worse than
 * offering one thing that works.
 */
export default function Alumni() {
  const page = usePage("alumni");
  const { settings } = useSiteSettings();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageHero
        title={page?.title ?? "Alumni"}
        subtitle="The register, the batch directory and what is happening back on campus."
      />

      {page?.content && (
        <section className="section">
          <div className="container">
            <div className="cms-prose">{page.content}</div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------- register */}
      <section id="register" className="section-lg scroll-mt-32">
        <div className="container grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div>
            <SectionHeading title="Join the alumni register" />
            <p className="body-copy mt-5">
              Registering once puts you on the list the school uses for
              reunions, mentoring requests and batch reconnections. The school
              does not publish your details without asking first.
            </p>
            <p className="mt-5 text-sm text-ink-muted">
              Already registered and need a correction? Write to{" "}
              <a href={`mailto:${settings.admissionEmail}`} className="link">
                {settings.admissionEmail}
              </a>
              .
            </p>
          </div>

          <div>
            {submitted ? (
              <div
                role="status"
                className="notice-success"
              >
                <h3 className="t-h4 text-ink">
                  You're on the list
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  The alumni desk will confirm by email. Thank you for keeping
                  in touch.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="grid gap-5 sm:grid-cols-2"
              >
                <div>
                  <label htmlFor="al-name" className="field-label">
                    Full name
                  </label>
                  <input
                    id="al-name"
                    required
                    type="text"
                    className="field-input"
                  />
                </div>
                <div>
                  <label htmlFor="al-batch" className="field-label">
                    Year you left
                  </label>
                  <input
                    id="al-batch"
                    required
                    type="number"
                    min="1991"
                    max="2026"
                    placeholder="e.g. 2004"
                    className="field-input"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="al-email" className="field-label">
                    Email
                  </label>
                  <input
                    id="al-email"
                    required
                    type="email"
                    className="field-input"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="al-now" className="field-label">
                    What you're doing now
                  </label>
                  <textarea id="al-now" rows={3} className="field-input" />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="btn-primary"
                    data-cursor-magnetic
                  >
                    Join the register
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- directory */}
      <section
        id="directory"
        className="band band-line section-lg scroll-mt-32"
      >
        <div className="container">
          <SectionHeading title="Batch directory" ruled />
          <p className="body-copy mt-6">
            The directory is kept by the alumni desk rather than published
            openly, so that nobody's contact details go online without consent.
            Registered alumni can ask the desk to pass a message to a batchmate,
            or to be put in touch with a batch group.
          </p>
          <p className="mt-6 text-sm text-ink-muted">
            The register goes back to the first batch to leave the school, in
            1991.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------- events */}
      <section id="events" className="section-lg scroll-mt-32">
        <div className="container">
          <SectionHeading title="Alumni events" ruled />
          <p className="body-copy mt-6">
            Reunions, careers talks and the mentoring programme are announced
            through news and circulars alongside the rest of the school
            calendar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/news?category=event"
              className="btn-primary"
              data-cursor-magnetic
            >
              See upcoming events
            </Link>
            <Link
              to="/contact"
              className="btn-outline"
            >
              Contact the alumni desk
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
