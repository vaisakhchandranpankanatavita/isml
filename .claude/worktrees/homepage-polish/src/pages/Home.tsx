import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Snap from 'lenis/snap';
import { useLenis } from '@/components/common/SmoothScroll';
import Parallax from '@/components/motion/Parallax';
import Hero from '@/components/sections/Hero';
import NewsEvents from '@/components/sections/NewsEvents';
import K12Journey from '@/components/sections/K12Journey';
import ExperienceGallery from '@/components/sections/ExperienceGallery';
import Media from '@/components/common/Media';
import { postsService } from '@/services/cms.service';
import { storage } from '@/services/storage';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import type { Post } from '@/types';
import CountUp from '@/components/common/CountUp';
import { Button } from '@/components/common/Button';
// Temporarily disabled — see the commented section below.
// import ProgramCarousel from '@/components/sections/ProgramCarousel';
import { SectionBoundary } from '@/components/common/SectionBoundary';

import PrincipalMessage from '@/components/sections/PrincipalMessage';
import FuturisticElement from '@/components/common/FuturisticElement';
import GlobalAtmosphere from '@/components/common/GlobalAtmosphere';

/**
 * Facts about the school, separated by rules rather than boxed into cards.
 * Static because they are the institution's constants — a founding year and
 * an acreage don't belong in a CMS field that can drift out of date.
 */
const GLANCE = [
  { value: '1981', label: 'Founded in Al Muladha', grouped: false },
  { value: '2,200', label: 'Students enrolled' },
  { value: '16', label: 'Acres of campus' },
  { value: 'KG-12', label: 'One continuous CBSE curriculum' },
];

/** Icon facts row — the "KG to Grade 12 / Students / Faculty / Holistic"
 * strip beneath the welcome copy, each with a small line-icon in the gold
 * accent, echoing the reference brief's masthead treatment. */
const ICON_FACTS: { icon: 'cap' | 'users' | 'book' | 'star'; value: string; label: string }[] = [
  { icon: 'cap', value: 'KG to Grade 12', label: 'CBSE Curriculum' },
  { icon: 'users', value: '2,200+', label: 'Students' },
  { icon: 'book', value: 'Experienced', label: 'Faculty' },
  { icon: 'star', value: 'Holistic', label: 'Development' },
];

const ICON_PATHS: Record<string, string> = {
  cap: 'M12 3 1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v3.64L12 21l7-4.18v-3.64l-7 4.18-7-4.18z',
  users:
    'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
  book: 'M4 4.5A2.5 2.5 0 016.5 2H20v17H6.5A2.5 2.5 0 004 16.5v-12zm2.5-.5a.5.5 0 00-.5.5V15a2.5 2.5 0 011-.83V4h-.5zM7 15h11V4H7v11zm-1 3.5a.5.5 0 00.5.5H18v-1H6.5a.5.5 0 00-.5.5z',
  star: 'M12 2l2.9 6.26L21.5 9.27l-4.75 4.63L17.9 21 12 17.77 6.1 21l1.15-7.1L2.5 9.27l6.6-1.01L12 2z',
};

function usePublishedPosts() {
  const [posts, setPosts] = useState<Post[]>(() => postsService.listPublished());
  useEffect(() => {
    const refresh = () => setPosts(postsService.listPublished());
    refresh();
    return storage.subscribe(refresh);
  }, []);
  return posts;
}

/**
 * Settles the page on one `.snap-section` at a time, driven by Lenis so the
 * snap glides with the same easing as ordinary wheel scrolling. (CSS
 * `scroll-snap` is deliberately not used: on <html> it fights Lenis's
 * per-frame scroll writes and makes the page stick.)
 *
 * `proximity`, not `mandatory`: a section taller than the viewport (a phone,
 * a long news grid) stays freely scrollable in its middle, and the footer
 * below the last section stays reachable. The snap only engages once the
 * reader stops within reach of a section's top edge. Scoped to this route by
 * living in Home's effect — every other page scrolls normally.
 *
 * `dep` re-registers the sections when CMS-driven ones appear or disappear.
 * Under reduced motion there's no Lenis instance, so nothing snaps.
 */
function useSectionSnap(dep: unknown) {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const snap = new Snap(lenis, {
      type: 'proximity',
      distanceThreshold: '40%',
      debounce: 120,
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.snap-section'));
    snap.addElements(sections, { align: ['start'] });

    return () => snap.destroy();
  }, [lenis, dep]);
}

export default function Home() {
  const { settings } = useSiteSettings();
  const posts = usePublishedPosts();
  useSectionSnap(`${posts.length}:${settings.k12Programs.length}`);

  return (
    <>
      <GlobalAtmosphere />
      <SectionBoundary fallback={<div className="py-20 text-center text-ink-muted">Unable to load Hero section.</div>}>
        <Hero />
      </SectionBoundary>

      {/* ------------------------------------------------------------- welcome
          Second section, right after the hero's footage — the reader's
          first stop once the video lets go. A layered atmosphere (drifting
          glow orbs, a faint rotating ring and a soft grid) sits behind the
          copy so the section keeps a trace of the hero's motion at a
          fraction of the intensity, while the layout itself — eyebrow,
          rule, framed photo, divided stat row — is built to read as a
          settled, editorial "about" beat rather than a second hero. */}
      <section className="snap-section band band-line relative flex min-h-screen flex-col justify-center overflow-hidden py-28 md:py-32">
        <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Slow drifting glow blobs, same recipe as GlobalAtmosphere's
              gradient blobs, so the section reads as one continuous
              backdrop language with the rest of the page rather than a
              one-off treatment. */}
          <motion.div
            animate={{ x: [0, 80, -60, 0], y: [0, -40, 30, 0], scale: [1, 1.15, 0.9, 1] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            className="absolute -left-1/4 -top-1/4 h-[55vw] w-[55vw] rounded-full bg-brand-600/5 blur-[120px]"
          />
          <motion.div
            animate={{ x: [0, -70, 50, 0], y: [0, 50, -30, 0], scale: [1, 0.9, 1.15, 1] }}
            transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-1/4 -right-1/4 h-[48vw] w-[48vw] rounded-full bg-brand-500/5 blur-[120px]"
          />

          <FuturisticElement className="top-[-15%] left-[-12%] h-80 w-80" delay={0} speed={18} />
          <FuturisticElement className="bottom-[-20%] right-[-12%] h-[26rem] w-[26rem]" delay={3} speed={26} />
          <FuturisticElement className="top-1/3 right-[8%] h-40 w-40" delay={6} speed={14} />
          <FuturisticElement className="bottom-1/4 left-[10%] h-56 w-56" delay={9} speed={22} />

          {/* A slow, near-imperceptible rotation gives the backdrop a sense
              of machinery ticking over rather than just pulsing in place. */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
            className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-500/10"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 130, repeat: Infinity, ease: 'linear' }}
            className="absolute left-1/2 top-1/2 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-brand-500/5"
          />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              color: 'currentColor',
            }}
          />
        </div>

        <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="rule-label">CBSE affiliated · Founded 1981</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-ink md:text-4xl">
              {settings.welcomeHeading || 'Welcome to Indian School Muladha'}
            </h2>
            <div className="cms-prose mt-6">{settings.welcomeBody}</div>
            <p className="body-copy mt-4">
              From a beginning with 9 teachers and 90 students, ISML has grown into one of
              the largest schools outside Muscat's capital area, with nearly 2,200 students
              across 56 sections from Pre-KG to Grade 12, on a 16-acre campus of classrooms,
              laboratories, a library and dedicated arts, music and sports facilities. The
              school remains one of the Indian Schools operating across the Sultanate of
              Oman under its Board of Directors, CBSE-affiliated (Affiliation No. 6130007,
              School Code 90170), and is grateful to His Majesty Sultan Haitham bin Tarik
              and the Government of Oman for the support that made, and keeps making, that
              growth possible.
            </p>
            <Button variant="outline" as="a" to="/about" className="mt-8">
              About the school
            </Button>

            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
              {ICON_FACTS.map((fact, index) => (
                <motion.li
                  key={fact.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.08 * index, ease: 'easeOut' }}
                  className="flex flex-col gap-2"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-marigold-500" fill="currentColor">
                    <path d={ICON_PATHS[fact.icon]} />
                  </svg>
                  <span className="font-display text-sm font-semibold text-ink">{fact.value}</span>
                  <span className="text-xs uppercase tracking-wide text-ink-muted">{fact.label}</span>
                </motion.li>
              ))}
            </ul>

            <dl className="mt-10 grid grid-cols-2 divide-y divide-paper-line sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              {GLANCE.map((fact, index) => {
                const isNumeric = /^[\d,]+$/.test(fact.value);
                return (
                  <motion.div
                    key={fact.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.1 * index, ease: 'easeOut' }}
                    className="py-4 pr-4 first:pl-0 sm:px-6 sm:py-0 sm:first:pl-0"
                  >
                    <dt className="sr-only">{fact.label}</dt>
                    <dd>
                      {isNumeric ? (
                        <CountUp
                          value={parseInt(fact.value.replace(/,/g, ''), 10) || 0}
                          grouped={fact.grouped !== false}
                          className="block font-display text-2xl font-bold text-ink md:text-3xl"
                        />
                      ) : (
                        <span className="block font-display text-2xl font-bold text-ink md:text-3xl">
                          {fact.value}
                        </span>
                      )}
                      <span className="mt-1 block text-xs uppercase tracking-wide text-ink-muted">
                        {fact.label}
                      </span>
                    </dd>
                  </motion.div>
                );
              })}
            </dl>
          </motion.div>

          <Parallax speed={0.85} className="relative">
            {/* Offset frame sitting behind the photo — a quiet signal of
                craft that also keeps the tile from floating unanchored in
                the section. */}
            <div
              aria-hidden
              className="absolute -bottom-4 -right-4 hidden h-full w-full border border-brand-500/20 sm:block"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
              className="spotlight-card relative aspect-[4/3] overflow-hidden bg-paper-band"
            >
              <Media src={settings.welcomeImageUrl} alt={`${settings.siteName} campus`} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
              className="absolute -bottom-6 left-6 hidden items-baseline gap-2 bg-paper px-5 py-3 shadow-lift sm:flex"
            >
              <span className="font-display text-xl font-bold text-brand-600">1981</span>
              <span className="text-xs uppercase tracking-wide text-ink-muted">Est. in Al Muladha</span>
            </motion.div>
          </Parallax>
        </div>
      </section>

      {/* ------------------------------------------------------------ at a glance
          Hidden for now — its stat text is now what plays behind the News
          section instead (see NewsShowcase.tsx). Kept, not deleted, in case
          the pinned reveal-panel treatment comes back.
      <section className="snap-section relative" style={{ height: '200vh' }}>
        <div className="sticky top-0 z-0 flex h-screen flex-col justify-center overflow-hidden bg-paper-sunk">
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <FuturisticElement className="top-[-10%] left-[-10%] w-96 h-96" delay={0} speed={15} />
            <FuturisticElement className="bottom-[-10%] right-[-10%] w-[500px] h-[500px]" delay={2} speed={25} />
            <FuturisticElement className="top-1/3 left-1/2 -translate-x-1/2 w-64 h-64" delay={5} speed={18} />
          </div>

          <div className="container relative z-10">
            <h2 className="sr-only">The school at a glance</h2>
            <dl className="register">
              {GLANCE.map((fact) => (
                <div key={fact.label} className="register__cell">
                  <dt className="sr-only">{fact.label}</dt>
                  <dd>
                    <CountUp
                      value={parseInt(fact.value.replace(/[^0-9]/g, '')) || 0}
                      className="register__value"
                    />
                    <span className="register__label block">{fact.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
      */}

      {/* ------------------------------------------------------- news & events
          Light, editorial two-column layout (numbered list + featured
          story), matching the reference brief. The old dark scroll-driven
          newsroom scene (NewsShowcase.tsx) is kept but no longer used. */}
      {posts.length > 0 && (
        <SectionBoundary fallback={<div className="py-20 text-center text-ink-muted">Unable to load News section.</div>}>
          <NewsEvents
            posts={posts.slice(0, 6)}
            siteName={settings.siteName}
            galleryImages={settings.experienceImages.slice(0, 2)}
          />
        </SectionBoundary>
      )}

      {/* --------------------------------------------------------- K-12 journey
          Its own light section — a horizontal five-stop timeline — rather
          than folded into the news canvas above. */}
      <SectionBoundary fallback={<div className="py-20 text-center text-ink-muted">Unable to load K-12 journey.</div>}>
        <K12Journey
          programs={settings.k12Programs}
          heading={settings.k12Heading || 'K-12 Journey of your child'}
        />
      </SectionBoundary>

      {/* ------------------------------------------------------- the programmes
          Hidden for now (the 3D ProgramCarousel is being replaced with a
          GSAP ScrollTrigger horizontal photo scroll) — kept, not deleted.
      {settings.k12Programs.length > 0 && (
        <section className="snap-section band band-line section-lg flex flex-col justify-center">
          <div className="container">
            <div className="section-head">
              <h2 className="text-2xl md:text-3xl">
                {settings.k12Heading || 'Kindergarten to Grade 12'}
              </h2>
              <Link to="/academics" className="link text-sm font-semibold">
                Academics in full
              </Link>
            </div>
            <p className="body-copy mt-6">
              Each stage is built on the one before it, so a student who joins in Kindergarten
              never meets a seam.
            </p>
            <SectionBoundary fallback={<div className="py-20 text-center text-ink-muted">Unable to load Programs section.</div>}>
              <ProgramCarousel programs={settings.k12Programs} />
            </SectionBoundary>
          </div>
        </section>
      )}
      */}

      {/* ------------------------------------------------ campus band + principal
          The one full-bleed photograph in the body of the page.
          The
          principal's message sits on it, because a signed message from a named
          person is the most institutional thing a school can put on a
          homepage. */}
      <SectionBoundary fallback={<div className="py-20 text-center text-ink-muted">Unable to load Principal Message.</div>}>
        <PrincipalMessage
          message={settings.principalMessage}
          name={settings.principalName}
          title={settings.principalTitle}
          imageUrl={settings.campusImageUrl || settings.principalImageUrl}
        />
      </SectionBoundary>

      {/* ------------------------------------------------------------- gallery
          Compact photo collage — "Experience @ISML" — matching the
          reference's short masthead treatment rather than a full-viewport
          set piece. */}
      {settings.experienceImages.length > 0 && (
        <SectionBoundary fallback={<div className="py-20 text-center text-ink-muted">Unable to load Gallery section.</div>}>
          <ExperienceGallery
            images={settings.experienceImages.slice(0, 8)}
            heading={settings.experienceHeading || 'More than just a school'}
            body={
              settings.experienceBody ||
              'A vibrant campus, modern facilities and a supportive community, where every child finds their place and purpose.'
            }
            tourLink={settings.tourLink}
          />
        </SectionBoundary>
      )}

      {/* --------------------------------------------------- tour + resources
          Two dark navy CTA blocks, side by side — the last "plain" beat
          before the footer. Not a `snap-section`: this closing strip stays
          content-height rather than forcing a full viewport. */}
      <section data-dark-ground className="flex flex-col border-t border-white/10 bg-brand-900 py-16 md:py-20">
        <div className="container grid gap-px overflow-hidden bg-white/10 md:grid-cols-2">
          <div className="flex flex-col gap-4 bg-brand-900 p-8 md:p-12">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-marigold-400" fill="currentColor">
              <path d={ICON_PATHS.cap} />
            </svg>
            <h2 className="font-display text-xl font-semibold text-white">
              {settings.tourHeading || 'Virtual Tour'}
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-white/70">
              {settings.tourBody ||
                'Explore our campus, classrooms and facilities from the comfort of your home.'}
            </p>
            {settings.tourLink && (
              <a
                href={settings.tourLink}
                {...(/^https?:\/\//.test(settings.tourLink)
                  ? { target: '_blank', rel: 'noreferrer' }
                  : {})}
                className="mt-2 inline-flex w-fit items-center justify-center gap-2 border border-marigold-400
                           px-6 py-2.5 text-sm font-medium text-marigold-300
                           transition-colors duration-300 hover:bg-marigold-400 hover:text-brand-900 focus-visible:outline-none
                           focus-visible:ring-2 focus-visible:ring-marigold-400"
              >
                Take a Virtual Tour
              </a>
            )}
          </div>
          <div className="flex flex-col gap-4 bg-brand-900 p-8 md:p-12">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-marigold-400" fill="currentColor">
              <path d={ICON_PATHS.book} />
            </svg>
            <h2 className="font-display text-xl font-semibold text-white">Student Resources</h2>
            <p className="max-w-sm text-sm leading-relaxed text-white/70">
              Timetables, syllabus, homework and CBSE results for the current session, in one
              place.
            </p>
            <Button variant="outline" as="a" to="/students" className="mt-2 w-fit border-white/40 text-white hover:bg-white/10">
              Open Resources
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
