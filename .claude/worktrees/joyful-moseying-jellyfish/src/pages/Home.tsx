import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Snap from 'lenis/snap';
import { useLenis } from '@/components/common/SmoothScroll';
import Parallax from '@/components/motion/Parallax';
import Hero from '@/components/sections/Hero';
import NewsShowcase from '@/components/sections/NewsShowcase';
import FilmStrip from '@/components/sections/FilmStrip';
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
  { value: '1981', label: 'Founded in Al Muladha' },
  { value: '2,200', label: 'Students enrolled' },
  { value: '16', label: 'Acres of campus' },
  { value: 'KG–12', label: 'One continuous CBSE curriculum' },
];

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
              the largest schools outside Muscat's capital area — nearly 2,200 students
              across 56 sections from Pre-KG to Grade 12, on a 16-acre campus of classrooms,
              laboratories, a library and dedicated arts, music and sports facilities. The
              school remains one of the Indian Schools operating across the Sultanate of
              Oman under its Board of Directors, CBSE-affiliated (Affiliation No. 6130007,
              School Code 90170) — and is grateful to His Majesty Sultan Haitham bin Tarik
              and the Government of Oman for the support that made, and keeps making, that
              growth possible.
            </p>
            <Button variant="outline" as="a" to="/about" className="mt-8">
              About the school
            </Button>

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

      {/* Second section: scroll-driven news showcase (its own dark canvas
          and rules — see NewsShowcase.tsx). Raised above the pinned "at a
          glance" panel so it slides up over it as the reader scrolls. Also
          folds in the K-12 journey carousel as a compact strip, rather than
          giving it a separate full-height section. */}
      {posts.length > 0 && (
        <div className="relative z-10">
          <SectionBoundary fallback={<div className="py-20 text-center text-ink-muted">Unable to load News section.</div>}>
            <NewsShowcase
              posts={posts.slice(0, 6)}
              programs={settings.k12Programs}
              journeyHeading={settings.k12Heading || 'Kindergarten to Grade 12'}
            />
          </SectionBoundary>
        </div>
      )}

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
          The photo section: a draggable 3D film strip (FilmStrip.tsx). */}
      {settings.experienceImages.length > 0 && (
        <SectionBoundary fallback={<div className="py-20 text-center text-ink-muted">Unable to load Gallery section.</div>}>
          <FilmStrip
            images={settings.experienceImages.slice(0, 8)}
            heading={settings.experienceHeading || 'Life on sixteen acres'}
            body={settings.experienceBody}
            siteName={settings.siteName}
          />
        </SectionBoundary>
      )}

      {/* --------------------------------------------------- tour + resources
          Llast "plain" beat before the footer.
          */}
      <section className="snap-section band band-line flex flex-col pb-16 pt-32 md:pb-24 md:pt-36">
        <div className="container grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h2 className="text-xl">{settings.tourHeading || 'Take a virtual tour'}</h2>
            <p className="body-copy mt-4">{settings.tourBody}</p>
            {settings.tourLink && (
              <a
                href={settings.tourLink}
                {...(/^https?:\/\//.test(settings.tourLink)
                  ? { target: '_blank', rel: 'noreferrer' }
                  : {})}
                className="mt-7 inline-flex items-center justify-center gap-2 border border-brand-600
                           bg-brand-600 px-6 py-2.5 text-sm font-medium text-white shadow-lift
                           transition-colors duration-300 hover:bg-brand-700 focus-visible:outline-none
                           focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                Walk the campus
              </a>
            )}
          </div>
          <div className="md:border-l md:border-paper-line md:pl-14">
            <h2 className="text-xl">Students resources</h2>
            <p className="body-copy mt-4">
              Time table, syllabus, homework and CBSE results for the current session, in one
              place.
            </p>
            <Button variant="outline" as="a" to="/students" className="mt-7">
              Open resources
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
