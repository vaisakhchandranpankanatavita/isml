import { motion } from 'framer-motion';
import PageHero from '@/components/common/PageHero';
import SectionHeading from '@/components/common/SectionHeading';
import Media from '@/components/common/Media';
import GlobalAtmosphere from '@/components/common/GlobalAtmosphere';
import FuturisticElement from '@/components/common/FuturisticElement';
import TextTrack from '@/components/common/TextTrack';
import { usePage } from '@/hooks/usePage';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const FALLBACK_BODY =
  'Indian School Muladha (ISML), started in 1981, is an English-medium co-educational school affiliated to CBSE. From a humble beginning with 9 teachers and 90 students, ISML has grown to become one of the largest schools outside the capital area with nearly 2200 students and 98 staff, spread across 16 acres of lush green land.';

const VALUES = [
  { title: 'Curiosity', body: 'We ask questions, and we like finding out.' },
  { title: 'Kindness', body: 'We treat everyone in the school with respect.' },
  { title: 'Excellence', body: 'We do our best work, not our quickest.' },
  { title: 'Integrity', body: 'We do the right thing when nobody is checking.' },
];

const GLANCE = [
  { value: '1981', label: 'Founded' },
  { value: '2,200', label: 'Students' },
  { value: '98', label: 'Faculty and staff' },
  { value: '16', label: 'Acres of campus' },
];

const FACILITIES = [
  { title: 'Laboratories', body: 'Physics, chemistry, biology and two computer laboratories.' },
  { title: 'Library', body: 'A lending library serving all sections of the school.' },
  { title: 'Sports', body: 'Playing fields, courts and an indoor activity hall.' },
  { title: 'Transport', body: 'Bus routes covering Al Muladha and the surrounding wilayat.' },
];

/**
 * Section ids on this page are linked directly from the main navigation
 * (`/about#principal`, `#management`, `#vision`, `#infrastructure`, `#campus`),
 * so they are load-bearing. `scroll-mt-32` clears the floating header.
 */
export default function About() {
  const page = usePage('about');
  const { settings } = useSiteSettings();

  return (
    <GlobalAtmosphere>
      <PageHero
        title={page?.title ?? 'About the school'}
        subtitle={settings.tagline}
        eyebrow="Established 1981 in Al Muladha"
      />

      {/* ------------------------------------------------------------- story */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="section-lg"
      >
        <div className="container grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div>
            <SectionHeading title="Our story" />
            <div className="cms-prose mt-6">{page?.content ?? FALLBACK_BODY}</div>
          </div>

          <div>
            <SectionHeading title="What we stand for" ruled />
            <dl className="mt-6 divide-y divide-paper-line">
              {VALUES.map((value) => (
                <div key={value.title} className="py-4">
                  <dt className="font-display text-base font-semibold text-ink">{value.title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink-soft">{value.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </motion.section>

      {/* -------------------------------------------------------- at a glance */}
      <section className="band band-line section">
        <div className="container">
          <h2 className="sr-only">The school at a glance</h2>
          <dl className="register">
            {GLANCE.map((fact) => (
              <div key={fact.label} className="register__cell">
                <dd>
                  <span className="register__value">{fact.value}</span>
                  <span className="register__label block">{fact.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------------------ vision */}
      <motion.section
        id="vision"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="section-lg scroll-mt-32"
      >
        <TextTrack text="LEGACY" />
        <div className="container grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <SectionHeading title="Vision" />
            <p className="body-copy mt-5">
              To be a school where every child leaves more capable and more curious than they
              arrived — prepared for the board examinations, and for what follows them.
            </p>
          </div>
          <div className="md:border-l md:border-paper-line md:pl-16">
            <SectionHeading title="Mission" />
            <p className="body-copy mt-5">
              To deliver the CBSE curriculum with care and consistency, in English, to the
              children of the Indian community in Oman; and to keep the school affordable to the
              families it was founded to serve.
            </p>
          </div>
        </div>
        <FuturisticElement />
      </motion.section>

      {/* --------------------------------------------------------- management */}
      <motion.section
        id="management"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="band band-line section-lg scroll-mt-32"
      >
        <div className="container">
          <SectionHeading title="Management" ruled />
          <p className="body-copy mt-6">
            The school is managed by an elected School Management Committee drawn from the parent
            community, working with the Principal and the senior academic staff. The Committee is
            responsible for the school's finances, appointments and long-term planning; academic
            matters rest with the Principal.
          </p>
          <p className="mt-6 text-sm text-ink-muted">
            For committee correspondence, write to{' '}
            <a href={`mailto:${settings.admissionEmail}`} className="link">
              {settings.admissionEmail}
            </a>
            .
          </p>
        </div>
      </motion.section>

      {/* ------------------------------------------------------------- campus */}
      <motion.section
        id="campus"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="section-lg scroll-mt-32"
      >
        <div className="container">
          <SectionHeading title="The campus" ruled />
          <figure className="mt-8">
            <div className="aspect-[16/9] overflow-hidden bg-paper-band">
              <Media
                src={settings.campusImageUrl}
                alt={`${settings.siteName} campus`}
              />
            </div>
            <figcaption className="mt-3 text-xs text-ink-muted">
              Sixteen acres at Al Muladha, in the Sultanate of Oman.
            </figcaption>
          </figure>
        </div>
      </motion.section>

      {/* ----------------------------------------------------- infrastructure */}
      <motion.section
        id="infrastructure"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="band band-line section-lg scroll-mt-32"
      >
        <div className="container">
          <SectionHeading title="Infrastructure" ruled />
          <dl className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {FACILITIES.map((f) => (
              <div key={f.title}>
                <dt className="font-display text-lg font-semibold text-ink">{f.title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-soft">{f.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.section>

      {/* ---------------------------------------------------------- principal */}
      <motion.section
        id="principal"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="section-lg scroll-mt-32"
      >
        <div className="container">
          <SectionHeading title="From the Principal" ruled />

          <div className="mt-8 grid gap-10 md:grid-cols-[16rem_1fr] md:gap-14">
            <figure>
              <div className="aspect-[4/5] overflow-hidden bg-paper-band">
                <Media
                  src={settings.principalImageUrl}
                  alt={settings.principalName}
                />
              </div>
              <figcaption className="mt-3">
                <span className="block font-display text-base font-semibold text-ink">
                  {settings.principalName}
                </span>
                <span className="block text-sm text-ink-muted">{settings.principalTitle}</span>
              </figcaption>
            </figure>

            <blockquote className="voice">{settings.principalMessage}</blockquote>
          </div>
        </div>
      </motion.section>
    </GlobalAtmosphere>
  );
}
