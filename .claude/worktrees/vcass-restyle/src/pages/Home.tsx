import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Hero from '@/components/sections/Hero';
import InlineImagesStatement from '@/components/sections/InlineImagesStatement';
import ProgramGrid from '@/components/sections/ProgramGrid';
import FloatingGallery from '@/components/sections/FloatingGallery';
import NewsCarousel from '@/components/sections/NewsCarousel';
import PrincipalMessage from '@/components/sections/PrincipalMessage';
import { postsService } from '@/services/cms.service';
import { storage } from '@/services/storage';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import type { Post } from '@/types';
import CountUp from '@/components/common/CountUp';
import { Button } from '@/components/common/Button';
import { SectionBoundary } from '@/components/common/SectionBoundary';

/**
 * Facts about the school. Static because they are the institution's
 * constants — a founding year and an acreage don't belong in a CMS field
 * that can drift out of date.
 */
const GLANCE = [
  { value: '1981', label: 'Founded in Al Muladha' },
  { value: '2,200', label: 'Students enrolled' },
  { value: '16', label: 'Acres of campus' },
  { value: 'KG–12', label: 'One CBSE curriculum' },
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
 * Homepage, composed in the reference site's order: video hero → a large
 * statement with inline photos → a four-up card grid → a principal's
 * message over full-bleed photography → the floating-photo gallery field →
 * the cream-amber news carousel → a last dark call-to-action band.
 */
export default function Home() {
  const { settings } = useSiteSettings();
  const posts = usePublishedPosts();
  const reduce = useReducedMotion();

  const photos = settings.experienceImages.map((img) => img.url).filter(Boolean) as string[];
  const pick = (i: number) => photos[i % Math.max(photos.length, 1)] ?? settings.welcomeImageUrl;

  return (
    <>
      <SectionBoundary fallback={<div className="py-20 text-center text-ink-muted">Unable to load Hero section.</div>}>
        <Hero />
      </SectionBoundary>

      <InlineImagesStatement
        segments={[
          { text: 'Since 1981', image: settings.welcomeImageUrl ?? pick(0) },
          { text: 'one campus in Al Muladha', image: pick(1) },
          { text: 'has grown into a community of', image: pick(2) },
          { text: 'two thousand students', image: pick(3) },
          { text: 'learning together.' },
        ]}
        lead={settings.welcomeBody || undefined}
      >
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-4">
          From a beginning with 9 teachers and 90 students, ISML has grown into one of the largest
          schools outside Muscat's capital area, with nearly 2,200 students across 56 sections from
          Pre-KG to Grade 12. It is one of the Indian Schools operating across the Sultanate of Oman
          under its Board of Directors, CBSE-affiliated (Affiliation No. 6130007, School Code
          90170), and is grateful to His Majesty Sultan Haitham bin Tarik and the Government of
          Oman for the support that made that growth possible.
        </p>
        <div className="mt-10">
          <Button variant="secondary" as="a" to="/about">
            About the school
          </Button>
        </div>

        <dl className="mt-[clamp(3.5rem,3.3839rem+0.4969vw,4rem)] grid grid-cols-2 border-t border-neutral-6 sm:grid-cols-4">
          {GLANCE.map((fact, index) => {
            const isNumeric = /^[\d,]+$/.test(fact.value);
            return (
              <motion.div
                key={fact.label}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.15 * index, ease: 'easeOut' }}
                className="px-2 pt-8"
              >
                <dt className="sr-only">{fact.label}</dt>
                <dd>
                  {isNumeric ? (
                    <CountUp
                      value={parseInt(fact.value.replace(/,/g, ''), 10) || 0}
                      className="block whitespace-nowrap font-display text-4xl font-extrabold leading-none text-[#f59021] md:text-5xl"
                    />
                  ) : (
                    <span className="block whitespace-nowrap font-display text-4xl font-extrabold leading-none text-[#f59021] md:text-5xl">
                      {fact.value}
                    </span>
                  )}
                  <span className="vc-label mt-3 block text-neutral-4">{fact.label}</span>
                </dd>
              </motion.div>
            );
          })}
        </dl>
      </InlineImagesStatement>

      {settings.k12Programs.length > 0 && (
        <>
          <section className="band-dark">
            <div className="container flex flex-wrap items-center justify-between gap-6 pb-4">
              <h2 className="text-[clamp(1.5768rem,1.2341rem+1.4658vw,3.0518rem)] text-neutral-2">
                {settings.k12Heading || 'Kindergarten to Grade 12'}
              </h2>
              <Button variant="secondary" as="a" to="/academics">
                Academics in full
              </Button>
            </div>
          </section>
          <ProgramGrid programs={settings.k12Programs} />
        </>
      )}

      <SectionBoundary fallback={<div className="py-20 text-center text-ink-muted">Unable to load Principal Message.</div>}>
        <PrincipalMessage
          message={settings.principalMessage}
          name={settings.principalName}
          title={settings.principalTitle}
          imageUrl={settings.principalImageUrl}
          backgroundUrl={settings.campusImageUrl}
        />
      </SectionBoundary>

      {photos.length > 0 && (
        <FloatingGallery
          images={settings.experienceImages}
          heading={settings.experienceHeading || 'ISML in action'}
          body={settings.experienceBody}
        />
      )}

      <NewsCarousel posts={posts.slice(0, 8)} />

      {/* Closing band: tour + resources, the VCASS two-up call to action. */}
      <section className="band-dark py-[clamp(5.25rem,4.3789rem+3.7267vw,9rem)]">
        <div className="container grid gap-12 md:grid-cols-2 md:gap-0">
          <div className="md:pr-14">
            <h2 className="text-5xl text-neutral-2 md:text-6xl">{settings.tourHeading || 'Take a virtual tour'}</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-4">{settings.tourBody}</p>
            {settings.tourLink && (
              <div className="mt-8">
                <Button
                  variant="accent"
                  as="a"
                  to={settings.tourLink}
                  {...(/^https?:\/\//.test(settings.tourLink) ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  Walk the campus
                </Button>
              </div>
            )}
          </div>
          <div className="border-neutral-6 md:border-l md:pl-14">
            <h2 className="text-5xl text-neutral-2 md:text-6xl">Student resources</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-4">
              Time table, syllabus, homework and CBSE results for the current session, in one place.
            </p>
            <div className="mt-8">
              <Button variant="secondary" as="a" to="/students">
                Open resources
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
