import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useInvertHover } from '@/hooks/useInvertHover';
import ScaffoldedText from '@/components/motion/ScaffoldedText';
import MeshGradient from '@/components/common/MeshGradient';
import GlassPanel from '@/components/common/GlassPanel';
import { Button } from '@/components/common/Button';

/**
 * Full-bleed cinematic hero.
 *
 * The media slot is type-agnostic on purpose. `settings.heroImageUrl` is
 * rendered as an <img> today, but the moment that field points at a video —
 * uploaded through the CMS media manager, which already stores `type: 'video'`
 * — `isVideo` picks it up and renders <video> instead. No code change needed
 * to go from a still to footage; set the field and the hero switches.
 *
 * Text sits on a bottom-anchored gradient plus a backdrop-blur scrim rather
 * than the raw photograph, because a school's hero image is user-supplied and
 * its brightness can't be predicted. The scrim is what guarantees the
 * headline stays legible over *any* footage — that's the "variable-opacity
 * backdrop filter mask" the brief asks for.
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
  const onInvertHover = useInvertHover();

  return (
    <section
      data-dark-ground
      className="snap-section relative isolate flex flex-col bg-obsidian overflow-hidden"
    >
      {/* ------------------------------------------------------------- media
          The shutter entrance: now refined with a multi-stage animation.
          Footage scales down 1.1 -> 1.0 while the frame opens. */}
      <motion.div
        className="absolute inset-0 -z-10 overflow-hidden"
        initial={reducedMotion ? false : { clipPath: 'inset(46% 0% 46% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        transition={{ type: 'spring', stiffness: 280, damping: 28, mass: 0.6 }}
      >
        <motion.div
          className="absolute inset-0"
          initial={reducedMotion ? false : { scale: 1.1, y: 24 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28, mass: 0.6 }}
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
            preload="metadata"
            aria-label={settings.heroCaption || `${settings.siteName} campus`}
          />
        </motion.div>

        <div className="grain-overlay" />

        {/* Dynamic Mesh Gradient: replaced static gradients with interactive light */}
        <MeshGradient />

        <div aria-hidden className="absolute inset-0 bg-obsidian/40" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent"
        />
      </motion.div>

      {/* -------------------------------------------------------------- copy
          The backdrop-blur scrim has been evolved into a GlassPanel for
          true immersive depth. */}
      <div className="container flex min-h-[34rem] flex-1 flex-col justify-end pb-16 pt-32 md:min-h-[40rem] md:pb-20 md:pt-36 lg:min-h-[44rem]">
        <div className="max-w-3xl p-6 md:p-8">
          {settings.announcementText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-7 inline-flex flex-wrap items-center gap-x-2 bg-white/15 px-4 py-1.5 text-sm text-white backdrop-blur-sm"
            >
              <span className="opacity-90">{settings.announcementText}</span>
              {settings.announcementLinkLabel && (
                <Link
                  to="/admissions"
                  className="font-semibold underline decoration-white/50 underline-offset-[3px] hover:decoration-white"
                >
                  {settings.announcementLinkLabel}
                </Link>
              )}
            </motion.div>
          )}

          <p className="rule-label rule-label--light">CBSE affiliated. Founded 1981.</p>

          <ScaffoldedText
            as="h1"
            eager
            text={settings.heroCaption || 'A school on sixteen acres in Al Muladha'}
            by="word"
            className="mt-6 font-display text-4xl font-bold leading-[1.08] text-white md:text-5xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg"
          >
            An English-medium, co-educational school serving the Indian community in the Sultanate
            of Oman, from Kindergarten through Grade 12.
          </motion.p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button variant="primary" as="a" to="/admissions">
              Apply for admission
            </Button>
            <Button variant="on-image" as="a" to="/contact#locate">
              Visit the campus
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
