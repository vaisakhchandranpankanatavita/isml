import { useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Button } from "@/components/common/Button";

const VIDEO_RE = /\.(mp4|webm|ogv|mov)(\?|#|$)|^data:video\//i;
const isVideo = (url?: string) => !!url && VIDEO_RE.test(url);
const DEFAULT_HERO_MEDIA = `${import.meta.env.BASE_URL}header.mp4`;

export default function Hero() {
  const { settings } = useSiteSettings();
  const reducedMotion = useReducedMotion();
  const media = settings.heroImageUrl;
  const video = isVideo(media) ? media : DEFAULT_HERO_MEDIA;
  const poster = isVideo(media) ? undefined : media;
  const headline =
    settings.heroCaption || "A place to grow, from the very first day.";

  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__media" aria-hidden="true">
        <video
          key={video}
          src={video}
          poster={poster}
          autoPlay={reducedMotion === false}
          loop={reducedMotion === false}
          muted
          playsInline
          preload="metadata"
        />
        <div className="home-hero__scrim" />
      </div>

      <div className="home-hero__content container">
        {settings.announcementText && (
          <p className="home-hero__announcement">
            <span>{settings.announcementText}</span>
            {settings.announcementLinkLabel && (
              <Link to="/admissions#enquire">
                {settings.announcementLinkLabel}
              </Link>
            )}
          </p>
        )}
        <h1 id="home-hero-title">{headline}</h1>
        <p className="home-hero__summary">
          An English-medium, co-educational CBSE school in Al Muladha, Oman, for
          every step from Pre-KG to Grade 12.
        </p>
        <div className="home-hero__actions">
          <Button variant="accent" as="a" to="/admissions#enquire">
            Enquire about admissions
          </Button>
          <Link className="home-hero__secondary" to="/gallery">
            Explore the campus <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
