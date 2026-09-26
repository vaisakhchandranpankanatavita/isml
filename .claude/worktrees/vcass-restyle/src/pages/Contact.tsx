import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '@/components/common/PageHero';
import SectionHeading from '@/components/common/SectionHeading';
import { useInvertHover } from '@/hooks/useInvertHover';
import { useSiteSettings } from '@/hooks/useSiteSettings';

/**
 * `#locate` and `#feedback` are both linked from the main navigation and the
 * footer, so those ids are load-bearing.
 */
export default function Contact() {
  const { settings } = useSiteSettings();
  const emails = (settings.contactEmails ?? []).filter(Boolean);
  const [submitted, setSubmitted] = useState(false);
  const onInvertHover = useInvertHover();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageHero
        title="Contact the school"
        subtitle="Office hours are Sunday to Thursday. The front office answers general enquiries; admissions has its own desk."
      />

      {/* ------------------------------------------------------------- locate */}
      <section id="locate" className="section-lg scroll-mt-32">
        <div className="container">
          <SectionHeading title="Where to find us" ruled />

          <div className="mt-8 grid gap-10 md:grid-cols-3 md:gap-12">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">Address</h3>
              <address className="mt-3 whitespace-pre-line text-sm not-italic leading-relaxed text-ink-soft">
                {settings.contactAddress || 'Address not set'}
              </address>
            </div>

            <div className="md:border-l md:border-paper-line md:pl-12">
              <h3 className="font-display text-lg font-semibold text-ink">Telephone</h3>
              {settings.contactPhone ? (
                <p className="mt-3">
                  <a
                    href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`}
                    className="link text-sm"
                  >
                    {settings.contactPhone}
                  </a>
                </p>
              ) : (
                <p className="mt-3 text-sm text-ink-muted">Not set</p>
              )}
              {settings.contactFax && (
                <p className="mt-2 text-sm text-ink-muted">Fax {settings.contactFax}</p>
              )}
            </div>

            <div className="md:border-l md:border-paper-line md:pl-12">
              <h3 className="font-display text-lg font-semibold text-ink">Email</h3>
              {emails.length ? (
                <ul className="mt-3 space-y-1.5">
                  {emails.map((e) => (
                    <li key={e}>
                      <a href={`mailto:${e}`} className="link break-all text-sm">
                        {e}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-ink-muted">Not set</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- feedback */}
      <section id="feedback" className="band band-line section-lg scroll-mt-32">
        <div className="container">
          <div className="max-w-2xl">
            <SectionHeading title="Send a message" />
            <p className="body-copy mt-4">
              General enquiries and feedback reach the front office. For admission questions,
              use the{' '}
              <Link to="/admissions#enquire" className="link">
                admission enquiry form
              </Link>{' '}
              instead — it goes straight to that desk.
            </p>

            {submitted ? (
              <div role="status" className="mt-8 border-l-4 border-brand-600 bg-paper-sunk p-6">
                <h3 className="font-display text-lg font-semibold text-ink">Message sent</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  The front office will pass this to the right desk.{' '}
                  {settings.contactPhone
                    ? `If it's urgent, telephone ${settings.contactPhone} during office hours.`
                    : "If it's urgent, use the address or email above to reach the front office."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="field-label">
                    Your name
                  </label>
                  <input id="contact-name" required type="text" className="field-input" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="field-label">
                    Email
                  </label>
                  <input id="contact-email" required type="email" className="field-input" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="contact-subject" className="field-label">
                    Subject
                  </label>
                  <input id="contact-subject" type="text" className="field-input" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="contact-message" className="field-label">
                    Message
                  </label>
                  <textarea id="contact-message" rows={5} required className="field-input" />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="btn-primary btn-invert"
                    data-cursor-magnetic
                    onPointerEnter={onInvertHover}
                  >
                    Send message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
