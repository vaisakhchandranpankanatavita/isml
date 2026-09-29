import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/motion/gsap";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Button } from "@/components/common/Button";

const VIDEO_RE = /\.(mp4|webm|ogv|mov)(\?|#|$)|^data:video\//i;
const isVideo = (url?: string) => !!url && VIDEO_RE.test(url);
const DEFAULT_HERO_MEDIA = `${import.meta.env.BASE_URL}header.mp4`;

/**
 * Pinned hero, ported from the reference: the wordmark is split around a
 * video window. While the section is pinned (360% of a viewport) the two
 * halves of the wordmark collapse to zero width, the window grows to fill the
 * screen and squares its corners, the video settles from a 1.35 zoom, and the
 * headline fades in over the finished frame. Phones run the same sequence over a shorter pin.
 */
export default function HeroPin() {
  const root = useRef<HTMLElement>(null);
  const { settings } = useSiteSettings();
  const media = settings.heroImageUrl;
  const video = isVideo(media) ? media : DEFAULT_HERO_MEDIA;
  const poster = isVideo(media) ? undefined : media;
  const headline = settings.heroCaption || "A place to grow, from the very first day.";

  // Mobile browsers can defer autoplay; nudge the muted inline video to start.
  useEffect(() => {
    const v = root.current?.querySelector("video");
    if (!v) return;
    v.muted = true;
    const start = () => void v.play().catch(() => {});
    start();
    v.addEventListener("loadeddata", start);
    document.addEventListener("touchstart", start, { once: true, passive: true });
    return () => {
      v.removeEventListener("loadeddata", start);
      document.removeEventListener("touchstart", start);
    };
  }, [video]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = <T extends Element>(sel: string) => gsap.utils.toArray<T>(el.querySelectorAll(sel));
      const mm = gsap.matchMedia();

      mm.add({ desktop: "(min-width: 992px)", motion: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
        if (!ctx.conditions?.motion) return;
        const desktop = !!ctx.conditions?.desktop;
        const words = q("[data-word]");
        const box = q("[data-box]");
        const vid = q("[data-vid]");
        const shade = q("[data-shade]");
        const fades = q("[data-fade-out]");
        const over = q("[data-overlay]");

        gsap.set(over, { opacity: 0, y: 30 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: desktop ? "+=360%" : "+=240%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // Once the video fills the screen the header switches to light text.
            onUpdate: (self) =>
              document.documentElement.classList.toggle("hero-expanded", self.isActive && self.progress > 0.62),
            onLeave: () => document.documentElement.classList.remove("hero-expanded"),
            onLeaveBack: () => document.documentElement.classList.remove("hero-expanded"),
          },
        });

        tl.to(fades, { opacity: 0, duration: 0.25 }, 0)
          .to(words, { width: 0, duration: 3, ease: "power2.inOut" }, 0.4)
          .to(
            box,
            {
              width: () => window.innerWidth + 2,
              height: () => window.innerHeight + 2,
              marginInline: 0,
              duration: 3.4,
            },
            0,
          )
          .to(box, { borderRadius: 0, duration: 2.8 }, 0.1)
          .fromTo(vid, { scale: 1.35 }, { scale: 1, duration: 2.6 }, 0)
          .to(shade, { opacity: 1, duration: 1.2 }, 2.4)
          .to(over, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 3.1);

        return () => document.documentElement.classList.remove("hero-expanded");
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="r-hero" aria-labelledby="hero-title">
      <div className="r-hero__meta" data-fade-out>
        <div className="container flex items-start justify-between gap-6 text-sm font-semibold sm:text-base">
          <ul data-r="fade" data-delay="1.0" className="r-chips" aria-label="About the school">
            <li className="r-chip r-chip--live">
              <span className="r-chip__dot" aria-hidden="true" />
              Al Muladha, Oman
            </li>
            <li className="r-chip">CBSE</li>
            <li className="r-chip">English medium</li>
            <li className="r-chip">Pre-KG – Grade 12</li>
          </ul>
          {settings.announcementText ? (
            <p data-r="fade" data-delay="1.2" className="hidden max-w-[30ch] text-right sm:block">
              {settings.announcementText}{" "}
              {settings.announcementLinkLabel && (
                <Link to="/admissions#enquire" className="underline underline-offset-4">
                  {settings.announcementLinkLabel}
                </Link>
              )}
            </p>
          ) : (
            <p data-r="fade" data-delay="1.2" className="hidden text-right sm:block">
              Est. 1981
            </p>
          )}
        </div>
      </div>

      <div className="r-hero__stage">
        <h1 id="hero-title" className="sr-only">
          {settings.siteName}. {headline}
        </h1>
        <div className="r-hero__row" aria-hidden="true">
          <span data-word className="r-hero__word">
            IS
          </span>
          <div data-box className="r-hero__video">
            <video
              data-vid
              key={video}
              src={video}
              poster={poster}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
            <div data-shade className="r-hero__shade" />
          </div>
          <span data-word className="r-hero__word">
            ML
          </span>
        </div>
      </div>

      <p data-fade-out className="r-hero__hint vc-label">
        Scroll
      </p>

      <div data-overlay className="r-hero__overlay">
        <div className="container grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <p className="max-w-[22ch] font-display text-4xl uppercase leading-[0.98] md:text-6xl">{headline}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Button as="a" to="/admissions#enquire" variant="accent">
              Enquire about admissions
            </Button>
            <Link to="/gallery" className="r-nav-link">
              Explore the campus ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
