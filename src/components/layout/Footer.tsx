import { Link } from "react-router-dom";
import { SCHOOL_CONTACT } from "@/config/site";
import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * Institutional footer: a link directory, not a marketing panel.
 *
 * Four columns of real navigation, the school's postal identity, and a legal
 * rule at the bottom. On an institution's site the footer is a genuine
 * wayfinding surface — often the fastest route to a form or a circular — so
 * it repeats the section structure rather than reducing to social icons.
 */

const COLUMNS: { heading: string; links: { label: string; to: string }[] }[] = [
  {
    heading: "About the school",
    links: [
      { label: "About ISML", to: "/about" },
      { label: "Principal's message", to: "/about#principal" },
      { label: "Campus and facilities", to: "/about#campus" },
      { label: "Photo gallery", to: "/gallery" },
    ],
  },
  {
    heading: "Admission",
    links: [
      { label: "Admission process", to: "/admissions" },
      { label: "Fee structure", to: "/admissions#fees" },
      { label: "Age criteria", to: "/admissions#age" },
      { label: "Transfer certificate", to: "/admissions#tc" },
    ],
  },
  {
    heading: "Academics",
    links: [
      { label: "Kindergarten to Grade 12", to: "/academics" },
      { label: "Time table", to: "/students#timetable" },
      { label: "Syllabus", to: "/students#syllabus" },
      { label: "CBSE results", to: "/students#results" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "News and events", to: "/news" },
      { label: "Students resources", to: "/students" },
      { label: "Alumni register", to: "/alumni#register" },
      { label: "Contact and location", to: "/contact#locate" },
    ],
  },
];

const SOCIAL: { label: string; href: string; path: string }[] = [
  {
    label: "Facebook",
    href: SCHOOL_CONTACT.social.facebook,
    path: "M22 12a10 10 0 10-11.6 9.87v-6.98H7.9V12h2.5V9.83c0-2.48 1.47-3.85 3.73-3.85 1.08 0 2.21.19 2.21.19v2.43h-1.25c-1.23 0-1.61.77-1.61 1.55V12h2.74l-.44 2.89h-2.3v6.98A10 10 0 0022 12z",
  },
  {
    label: "Instagram",
    href: SCHOOL_CONTACT.social.instagram,
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.24 2.23.4.56.21.96.47 1.38.89.42.42.68.82.89 1.38.16.42.35 1.06.4 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.8-.4 2.23-.21.56-.47.96-.89 1.38-.42.42-.82.68-1.38.89-.42.16-1.06.35-2.23.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.24-2.23-.4a3.7 3.7 0 01-1.38-.89 3.7 3.7 0 01-.89-1.38c-.16-.42-.35-1.06-.4-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.24-1.8.4-2.23.21-.56.47-.96.89-1.38.42-.42.82-.68 1.38-.89.42-.16 1.06-.35 2.23-.4C8.42 2.17 8.8 2.16 12 2.16zm0 1.8c-3.14 0-3.51.01-4.75.07-1 .05-1.55.21-1.91.35-.48.19-.83.41-1.2.77-.36.36-.58.72-.77 1.2-.14.36-.3.91-.35 1.91-.06 1.24-.07 1.61-.07 4.75s.01 3.51.07 4.75c.05 1 .21 1.55.35 1.91.19.48.41.83.77 1.2.36.36.72.58 1.2.77.36.14.91.3 1.91.35 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c1-.05 1.55-.21 1.91-.35.48-.19.83-.41 1.2-.77.36-.36.58-.72.77-1.2.14-.36.3-.91.35-1.91.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.05-1-.21-1.55-.35-1.91a3.02 3.02 0 00-.77-1.2 3.02 3.02 0 00-1.2-.77c-.36-.14-.91-.3-1.91-.35-1.24-.06-1.61-.07-4.75-.07zm0 3.06a5 5 0 110 10 5 5 0 010-10zm0 1.8a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4zm5.24-2.15a1.17 1.17 0 110 2.35 1.17 1.17 0 010-2.35z",
  },
  {
    label: "Twitter",
    href: SCHOOL_CONTACT.social.twitter,
    path: "M22 5.9a8.2 8.2 0 01-2.36.65A4.1 4.1 0 0021.44 4a8.19 8.19 0 01-2.6 1A4.1 4.1 0 0011.9 8.8a11.65 11.65 0 01-8.46-4.29 4.1 4.1 0 001.27 5.47 4.07 4.07 0 01-1.86-.52v.05a4.1 4.1 0 003.29 4.02 4.1 4.1 0 01-1.85.07 4.1 4.1 0 003.83 2.84A8.23 8.23 0 012 18.29a11.62 11.62 0 006.29 1.84c7.55 0 11.68-6.25 11.68-11.67v-.53A8.36 8.36 0 0022 5.9z",
  },
  {
    label: "YouTube",
    href: SCHOOL_CONTACT.social.youtube,
    path: "M23.5 6.2a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 00.5 6.2 31.5 31.5 0 000 12a31.5 31.5 0 00.5 5.8 3.02 3.02 0 002.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.56a3.02 3.02 0 002.12-2.14A31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const { settings } = useSiteSettings();

  return (
    // Navigation footer: a large condensed statement, link directory, and
    // round social chips on the theme-aware page ground.
    <footer data-dark-ground className="site-footer band-dark mt-auto">
      <div
        aria-hidden
        className="site-footer__glow pointer-events-none absolute inset-0 overflow-hidden"
      />
      <div className="container relative z-10 py-8 sm:py-10">
        <div className="site-footer__glass rounded-2xl px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-12 xl:gap-16">
            <div className="flex flex-col items-start gap-6">
              <nav
                aria-label="Footer utility"
                className="self-stretch border-b border-neutral-6 pb-4"
              >
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  <li>
                    <Link
                      to="/contact"
                      className="vc-label text-neutral-3 hover:text-school-red"
                    >
                      Contact us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admissions"
                      className="vc-label text-neutral-3 hover:text-school-red"
                    >
                      Enrol
                    </Link>
                  </li>
                </ul>
              </nav>

              <p className="max-w-[14ch] font-display text-[2.25rem] font-semibold uppercase leading-[0.95] tracking-[-0.01em] text-neutral-2">
                {settings.tagline || "In pursuit of excellence"}
              </p>

              <div className="space-y-3 text-sm text-neutral-4">
                <address className="whitespace-pre-line not-italic leading-relaxed">
                  {settings.contactAddress}
                </address>
                <p>
                  <a
                    href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
                    className="text-neutral-2 hover:text-school-red"
                  >
                    {settings.contactPhone}
                  </a>
                  {settings.contactFax && (
                    <span className="block">Fax {settings.contactFax}</span>
                  )}
                </p>
                <p className="flex flex-col">
                  {settings.contactEmails.map((email) => (
                    <a
                      key={email}
                      href={`mailto:${email}`}
                      className="text-neutral-2 hover:text-school-red"
                    >
                      {email}
                    </a>
                  ))}
                </p>
              </div>

              <ul className="flex gap-2">
                {SOCIAL.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      aria-label={s.label}
                      className="vc-icon-btn [--btn-bg:#363633] [--btn-fg:#e6e5dd]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="currentColor"
                      >
                        <path d={s.path} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <nav
              aria-label="Footer"
              className="grid content-start gap-x-8 gap-y-7 sm:grid-cols-2 xl:grid-cols-4 xl:gap-x-6"
            >
              {COLUMNS.map((col) => (
                <div key={col.heading}>
                  <h2 className="text-lg font-semibold leading-tight tracking-[0.02em] text-school-red">{col.heading}</h2>
                  <ul className="mt-3 space-y-2">
                    {col.links.map((l) => (
                      <li key={l.to}>
                        <Link
                          to={l.to}
                          className="text-[0.95rem] font-normal leading-snug text-neutral-3 transition-colors hover:text-neutral-1"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="site-footer__legal relative z-10 border-t border-neutral-6">
        <div className="container flex flex-col items-start justify-between gap-3 py-4 text-xs text-neutral-5 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="h-9 w-9" />
            <span className="font-display text-base font-semibold uppercase leading-none tracking-[0.02em] text-neutral-3">
              {settings.siteName}
            </span>
          </div>
          <p>
            © {year} {settings.siteName}. CBSE affiliated, English medium,
            co-educational. Founded 1981.
          </p>
        </div>
      </div>
    </footer>
  );
}
