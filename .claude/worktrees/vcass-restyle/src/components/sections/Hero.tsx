import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import ScaffoldedText from '@/components/motion/ScaffoldedText';
import { Button } from '@/components/common/Button';

/**
 * Full-viewport hero, modelled on the VCASS BlockHero: footage under a 20%
 * scrim, one centred display headline revealed word by word, amber sub-copy.
 *
 * The media slot is type-agnostic: when `settings.heroImageUrl` points at a
 * video it plays that; a still becomes the poster over the shipped footage.
 */

const VIDEO_RE = /\.(mp4|webm|ogv|mov)(\?|#|$)|^data:video\//i;
const isVideo = (url?: string) => !!url && VIDEO_RE.test(url);

/**
 * Shipped campus footage, served from `public/`. Acts as the default hero
 * media so the homepage has motion out of the box; anything set in Settings
 * overrides it, which is how an editor swaps in new footage or a still
 * without touching code.
 */
const DEFAULT_HERO_MEDIA = '/header.mp4';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/**
 * Ties the footage's playback rate to scroll speed: scroll fast, the video
 * runs slightly fast; stop scrolling, it eases back to 1×. Clamped tight
 * (0.85–1.35×) so it reads as "this environment is reacting to you" rather
 * than as a visibly sped-up tape. Skipped entirely for reduced motion — a
 * variable-speed background is exactly the kind of vestibular trigger that
 * preference exists to opt out of.
 */
function useScrollVelocityPlayback(videoRef: React.RefObject<HTMLVideoElement>, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video) return;

    let lastY = window.scrollY;
    let lastT = performance.now();
    let raf = 0;

    const decay = () => {
      video.playbackRate += (1 - video.playbackRate) * 0.08;
      if (Math.abs(video.playbackRate - 1) > 0.01) {
        raf = requestAnimationFrame(decay);
      } else {
        video.playbackRate = 1;
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      const t = performance.now();
      const dt = Math.max(t - lastT, 1);
      const speed = Math.abs(y - lastY) / dt;
      lastY = y;
      lastT = t;

      const rate = Math.min(1.35, Math.max(0.85, 1 + speed * 0.6));
      video.playbackRate = rate;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(decay);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [videoRef, enabled]);
}

export default function Hero() {
  const { settings } = useSiteSettings();
  const reducedMotion = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  useScrollVelocityPlayback(videoRef, !reducedMotion);

  const video = isVideo(settings.heroImageUrl) ? settings.heroImageUrl : DEFAULT_HERO_MEDIA;
  const poster = isVideo(settings.heroImageUrl) ? undefined : settings.heroImageUrl;
  const headline = settings.heroCaption || 'A school on sixteen acres';
  // The reference's display size is set for a four-word headline; a longer
  // CMS caption steps down a size so it still sits clear of the nav bar.
  const long = headline.split(/\s+/).length > 5;

  return (
    <section
      data-dark-ground
      className="snap-section band-dark relative isolate flex h-[100lvh] min-h-[600px] flex-col overflow-hidden"
    >
      {/* VCASS BlockHero media: fades in over 1s after a 0.8s beat, under a
          flat 20% black scrim. */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8, ease: 'linear' }}
      >
        <video
          key={video}
          ref={videoRef}
          className="h-full w-full object-cover"
          src={video}
          poster={poster}
          autoPlay={!reducedMotion}
          loop={!reducedMotion}
          muted
          playsInline
          controls={reducedMotion}
          preload="auto"
          aria-label={settings.heroCaption || `${settings.siteName} campus`}
        />
        <div aria-hidden className="absolute inset-0 bg-black/20" />
      </motion.div>

      <div className="container flex h-full flex-col items-center justify-center gap-4 pb-10 pt-[calc(var(--vc-nav-top)+var(--vc-nav-height)+2rem)] text-center">
        {settings.announcementText && (
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', duration: 0.7, delay: 0.6 }}
            className="vc-label mb-2 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full bg-neutral-7/70 px-5 py-2.5 text-neutral-2 backdrop-blur-sm"
          >
            <span>{settings.announcementText}</span>
            {settings.announcementLinkLabel && (
              <Link to="/admissions" className="text-[#f59021] underline-offset-4 hover:underline">
                {settings.announcementLinkLabel}
              </Link>
            )}
          </motion.p>
        )}
        <ScaffoldedText
          as="h1"
          eager
          text={headline}
          by="word"
          className={
            long
              ? 'max-w-[18ch] text-[clamp(2.5257rem,1.3817rem+4.8943vw,7.4506rem)] font-extrabold leading-[0.85] tracking-[-0.03em] text-neutral-2'
              : 'vc-display max-w-[14ch] text-neutral-2'
          }
        />

        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', duration: 0.7, delay: 0.8 }}
          className="max-w-[38ch] font-display text-xl font-semibold leading-[1.1] tracking-[-0.02em] text-[#eb8900] md:text-3xl"
        >
          An English-medium, co-educational CBSE school in Al Muladha, Oman, from Kindergarten
          through Grade 12.
        </motion.p>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', duration: 0.7, delay: 1 }}
          className="mt-6 flex flex-wrap justify-center gap-3"
        >
          <Button variant="secondary" as="a" to="/admissions">
            Apply for admission
          </Button>
          <Button variant="primary" as="a" to="/contact#locate">
            Visit the campus
          </Button>
        </motion.div>
      </div>

    </section>
  );
}
