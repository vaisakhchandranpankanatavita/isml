import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/common/PageHero";
import SectionHeading from "@/components/common/SectionHeading";
import { usePage } from "@/hooks/usePage";
import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * Section ids here are linked from the main navigation (`/admissions#fees`,
 * `#age`, `#tc`), so they are load-bearing. `scroll-mt-32` clears the
 * floating header.
 */

const STEPS = [
  {
    title: "Enquire",
    body: "Send the form below, or write to the admissions office directly. Tell us the grade and the academic year you are asking about.",
  },
  {
    title: "Submit documents",
    body: "Birth certificate, passport and residence card copies, the previous school report, and a transfer certificate where one applies.",
  },
  {
    title: "Assessment and interaction",
    body: "Applicants for Grade 1 and above sit a short assessment in English and mathematics. Kindergarten entry is by interaction.",
  },
  {
    title: "Offer and enrolment",
    body: "Where a seat is available, the office confirms the offer in writing and sets a date for fee payment and enrolment.",
  },
];

const AGE_CRITERIA = [
  { grade: "Pre-KG", age: "3 years by 31 March" },
  { grade: "KG", age: "4 years by 31 March" },
  { grade: "Grade 1", age: "5 years and 6 months by 31 March" },
];

export default function Admissions() {
  const [submitted, setSubmitted] = useState(false);
  const page = usePage("admissions");
  const { settings } = useSiteSettings();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageHero
        title={page?.title ?? "Admission"}
        subtitle={
          settings.announcementText ||
          "How to apply for a seat, and what the school will need."
        }
      />

      {/* ------------------------------------------------------------ process */}
      <section className="section-lg">
        <div className="container grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
          <div>
            <SectionHeading title="The admission process" />
            <div className="cms-prose mt-6">
              {page?.content ??
                "The admissions office handles enquiries for all grades. The steps below apply to a normal mid-year or new-session application."}
            </div>

            {/* A genuine sequence, so it is numbered. */}
            <ol className="mt-10 divide-y divide-paper-line border-y border-paper-line">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-5 py-6">
                  <span className="step-marker mt-0.5">{i + 1}</span>
                  <div>
                    <h3 className="t-h4 text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* CSS grid stretches this column to match the four numbered
              steps beside it by default, but the office info itself is much
              shorter — left top-aligned, that stretch just becomes a void
              below the address. Centring it within the stretched height
              reads as a deliberate composition instead. */}
          <aside className="flex flex-col justify-center">
            <div>
              <SectionHeading title="Admissions office" ruled />
              <dl className="mt-6 divide-y divide-paper-line">
                {settings.admissionEmail && (
                  <div className="py-4">
                    <dt className="text-xs text-ink-muted">Email</dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${settings.admissionEmail}`}
                        className="link break-all text-sm"
                      >
                        {settings.admissionEmail}
                      </a>
                    </dd>
                  </div>
                )}
                {settings.contactPhone && (
                  <div className="py-4">
                    <dt className="text-xs text-ink-muted">Telephone</dt>
                    <dd className="mt-1">
                      <a
                        href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
                        className="link text-sm"
                      >
                        {settings.contactPhone}
                      </a>
                    </dd>
                  </div>
                )}
                <div className="py-4">
                  <dt className="text-xs text-ink-muted">Address</dt>
                  <dd className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                    {settings.contactAddress}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {/* -------------------------------------------------------- enquiry form */}
      <section id="enquire" className="band band-line section-lg scroll-mt-32">
        <div className="container">
          <div className="max-w-2xl">
            <SectionHeading title="Enquiry form" />
            <p className="body-copy mt-4">
              Send this and the admissions office will reply with the current
              seat position for the grade you have asked about.
            </p>

            {submitted ? (
              <div
                role="status"
                className="notice-success mt-6 sm:p-5"
              >
                <h3 className="t-h4 text-ink">
                  Enquiry sent
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  The admissions office will be in touch. If your question is
                  urgent, telephone {settings.contactPhone} during office hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-8 grid gap-5 sm:grid-cols-2"
              >
                <div>
                  <label htmlFor="adm-parent" className="field-label">
                    Parent name
                  </label>
                  <input
                    id="adm-parent"
                    required
                    type="text"
                    className="field-input"
                  />
                </div>
                <div>
                  <label htmlFor="adm-phone" className="field-label">
                    Phone
                  </label>
                  <input
                    id="adm-phone"
                    required
                    type="tel"
                    className="field-input"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="adm-email" className="field-label">
                    Email
                  </label>
                  <input
                    id="adm-email"
                    required
                    type="email"
                    className="field-input"
                  />
                </div>
                <div>
                  <label htmlFor="adm-grade" className="field-label">
                    Grade applying for
                  </label>
                  <select
                    id="adm-grade"
                    required
                    className="field-input"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a grade
                    </option>
                    <option>Pre-KG</option>
                    <option>KG</option>
                    <option>Grade 1</option>
                    <option>Grade 6</option>
                    <option>Grade 9</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="adm-year" className="field-label">
                    Academic year
                  </label>
                  <input
                    id="adm-year"
                    type="text"
                    defaultValue="2026-27"
                    className="field-input"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="adm-message" className="field-label">
                    Anything else we should know
                  </label>
                  <textarea id="adm-message" rows={4} className="field-input" />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="btn-primary"
                    data-cursor-magnetic
                  >
                    Send enquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- fees */}
      <section id="fees" className="section-lg scroll-mt-32">
        <div className="container">
          <SectionHeading title="Fee structure" ruled />
          <p className="body-copy mt-6">
            Fees are set by the School Management Committee for each academic
            year and are payable by term. The current schedule, including the
            one-time admission fee and transport charges by route, is issued as
            a circular.
          </p>
          <p className="mt-6 text-sm text-ink-muted">
            For the current year's schedule, write to{" "}
            <a href={`mailto:${settings.admissionEmail}`} className="link">
              {settings.admissionEmail}
            </a>{" "}
            or see the circulars in{" "}
            <Link to="/news?category=announcement" className="link">
              news and circulars
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- age */}
      <section id="age" className="band band-line section-lg scroll-mt-32">
        <div className="container">
          <SectionHeading title="Age criteria" ruled />
          <p className="body-copy mt-6">
            Entry age is fixed against 31 March of the year the session begins,
            in line with CBSE norms.
          </p>
          <dl className="register mt-8">
            {AGE_CRITERIA.map((row) => (
              <div key={row.grade} className="register__cell">
                <dt className="register__label">{row.grade}</dt>
                <dd className="register__value">{row.age}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ----------------------------------------------------------------- tc */}
      <section id="tc" className="section-lg scroll-mt-32">
        <div className="container">
          <SectionHeading title="Transfer certificate and withdrawal" ruled />
          <p className="body-copy mt-6">
            A transfer certificate is issued once all dues are cleared. Requests
            should reach the school office at least two weeks before the
            certificate is needed, and a parent or guardian named on the
            student's record must make the request.
          </p>
          <p className="body-copy mt-4">
            Withdrawal during a term requires a month's written notice; fees for
            the term in progress remain payable.
          </p>
        </div>
      </section>
    </>
  );
}
