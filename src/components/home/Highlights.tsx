import { Link } from "react-router-dom";

const PILLARS = [
  { title: "CBSE affiliated", body: "Affiliation No. 6130007 · School Code 90170, following the curriculum of the Central Board of Secondary Education, India." },
  { title: "Part of a network of 21", body: "One of 21 Indian schools across the Sultanate of Oman, sharing standards, exchange and community." },
  { title: "Open to every child", body: "A co-educational, English-medium school for Pre-KG to Grade 12, run as a non-political, secular, non-profit institution." },
  { title: "Rooted in Al Muladha", body: "A 16-acre campus with classrooms, labs, sports grounds and an auditorium built around how children learn." },
];

/** Numbered pillars: what the school stands on, in four short lines. */
export function Pillars() {
  return (
    <section className="container home-section" aria-labelledby="pillars-title">
      <p data-r="fade-up" className="vc-label">
        Why families choose ISML
      </p>
      <h2
        id="pillars-title"
        data-r="words"
        className="mt-4 max-w-[16ch] text-[clamp(2.75rem,10vw,10rem)] leading-[1.02] tracking-[-0.02em]"
      >
        Built on trust, in four ways.
      </h2>
      <ol className="home-gap grid border-t border-paper-line md:grid-cols-2">
        {PILLARS.map((p, i) => (
          <li
            key={p.title}
            data-r="fade-up"
            data-delay={String(0.1 + (i % 2) * 0.15)}
            className="flex gap-5 border-b border-paper-line py-7 md:px-6 md:odd:border-r md:odd:pl-0 md:even:pr-0"
          >
            <span className="font-display text-3xl leading-none text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="text-2xl leading-tight">{p.title}</h3>
              <p className="mt-2 text-base font-medium leading-snug text-ink-soft">{p.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

const LINKS = [
  { to: "/admissions", label: "Admissions 2026–27", hint: "How to apply" },
  { to: "/students", label: "CBSE results & circulars", hint: "Students & parents" },
  { to: "/gallery", label: "Virtual campus tour", hint: "Photos & 360° views" },
  { to: "/infrastructure", label: "Infrastructure", hint: "Labs, sports, library" },
  { to: "/faculty", label: "Faculty", hint: "Meet our teachers" },
  { to: "/mandatory-public-disclosure", label: "Public disclosure", hint: "CBSE mandatory data" },
];

/** Quick links: large tappable rows for the pages families look for most. */
export function QuickLinks() {
  return (
    <section data-role-section="dark" className="home-section" aria-labelledby="quick-title">
      <div className="container grid gap-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <p data-r="fade-up" className="vc-label">
            Quick links
          </p>
          <h2
            id="quick-title"
            data-r="words"
            className="mt-4 text-[clamp(2.5rem,7.5vw,7.5rem)] leading-[1] tracking-[-0.02em]"
          >
            Find it fast.
          </h2>
        </div>
        <ul className="border-t border-white/15 lg:col-span-8">
          {LINKS.map((l, i) => (
            <li key={l.to} data-r="fade-up" data-delay={String(0.05 * i)} className="border-b border-white/15">
              <Link to={l.to} className="group flex min-h-[4.5rem] items-center justify-between gap-4 py-4">
                <span>
                  <span className="block font-display text-2xl uppercase leading-none md:text-4xl">{l.label}</span>
                  <span className="mt-1.5 block text-sm font-semibold text-neutral-4">{l.hint}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="grid h-11 w-11 flex-none place-items-center rounded-full border border-white/25 transition-all duration-300 ease-ref-image group-hover:border-lime group-hover:bg-lime group-hover:text-obsidian"
                >
                  ↗
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

interface TouchProps {
  address: string;
  phone: string;
  emails: string[];
}

/** Get in touch: address, phone and email as three tap-to-act cards. */
export function GetInTouch({ address, phone, emails }: TouchProps) {
  const items = [
    { label: "Visit", value: address, href: `https://maps.google.com/?q=${encodeURIComponent(address)}` },
    { label: "Call", value: phone, href: `tel:${phone.replace(/[^+\d]/g, "")}` },
    ...emails.slice(0, 1).map((e) => ({ label: "Write", value: e, href: `mailto:${e}` })),
  ].filter((i) => i.value);

  return (
    <section className="container home-section" aria-labelledby="touch-title">
      <p data-r="fade-up" className="vc-label">
        Get in touch
      </p>
      <h2
        id="touch-title"
        data-r="words"
        className="mt-4 max-w-[14ch] text-[clamp(2.75rem,10vw,10rem)] leading-[1.02] tracking-[-0.02em]"
      >
        We&rsquo;d love to hear from you.
      </h2>
      <ul className="home-gap grid gap-4 md:grid-cols-3">
        {items.map((it, i) => (
          <li key={it.label} data-r="fade-up" data-delay={String(0.1 * i)}>
            <a
              href={it.href}
              {...(it.label === "Visit" ? { target: "_blank", rel: "noreferrer" } : {})}
              className="group flex h-full flex-col justify-between gap-10 rounded-[0.5rem] border border-paper-line bg-paper-light p-6 transition-colors duration-300 hover:bg-lime"
            >
              <span className="vc-label">{it.label}</span>
              <span className="break-words text-xl font-semibold leading-snug">{it.value}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
