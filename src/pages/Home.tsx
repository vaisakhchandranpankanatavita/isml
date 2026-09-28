import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReveal } from "@/components/motion/reveal";
import Hero from "@/components/sections/Hero";
import OurStory from "@/components/sections/OurStory";
import ProgramGrid from "@/components/sections/ProgramGrid";
import PhotoMarquee from "@/components/sections/PhotoMarquee";
import FloatingGallery from "@/components/sections/FloatingGallery";
import NewsCarousel from "@/components/sections/NewsCarousel";
import PrincipalMessage from "@/components/sections/PrincipalMessage";
import { postsService } from "@/services/cms.service";
import { storage } from "@/services/storage";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import type { Post } from "@/types";
import { Button } from "@/components/common/Button";
import { SectionBoundary } from "@/components/common/SectionBoundary";

function usePublishedPosts() {
  const [posts, setPosts] = useState<Post[]>(() =>
    postsService.listPublished(),
  );
  useEffect(() => {
    const refresh = () => setPosts(postsService.listPublished());
    refresh();
    return storage.subscribe(refresh);
  }, []);
  return posts;
}

/**
 * Homepage, composed in the reference site's order: video hero → editorial
 * school story → learning journey → a principal's
 * message on the night band → the image-filled experience mosaic → the news
 * carousel → a closing night band of two call-to-action panels. Every
 * section shares the `--home-*` tokens and primitives in index.css.
 */
export default function Home() {
  const { settings } = useSiteSettings();
  const posts = usePublishedPosts();
  const reveal = useReveal();
  const photos = settings.experienceImages
    .map((img) => img.url)
    .filter(Boolean) as string[];

  return (
    <>
      <SectionBoundary
        fallback={
          <div className="py-20 text-center text-ink-muted">
            Unable to load Hero section.
          </div>
        }
      >
        <Hero />
      </SectionBoundary>

      <OurStory />

      <ProgramGrid programs={settings.k12Programs} />

      <PhotoMarquee />

      <SectionBoundary
        fallback={
          <div className="py-20 text-center text-ink-muted">
            Unable to load Principal Message.
          </div>
        }
      >
        <PrincipalMessage
          message={settings.principalMessage}
          name={settings.principalName}
          title={settings.principalTitle}
          imageUrl={settings.principalImageUrl || "/principal.jpg"}
        />
      </SectionBoundary>

      {photos.length > 0 && (
        <FloatingGallery
          images={settings.experienceImages}
          heading={settings.experienceHeading || "Experience @ ISML"}
          body={settings.experienceBody}
        />
      )}

      <NewsCarousel posts={posts.slice(0, 8)} />

      {/* Closing band: tour + resources as two matching panels. */}
      <section
        className="home-section home-section--night home-cta"
        aria-label="Visit and resources"
      >
        <div className="home-aura" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="container home-cta__grid">
          <motion.div className="home-cta__panel" {...reveal()}>
            <img
              className="home-cta__photo"
              src={`${import.meta.env.BASE_URL}home/independence-parade.jpg`}
              alt=""
              loading="lazy"
            />
            <p className="home-eyebrow">Visit ISML</p>
            <h2 className="home-title">
              {settings.tourHeading || "Take a virtual tour"}
            </h2>
            {settings.tourBody && (
              <p className="home-body">{settings.tourBody}</p>
            )}
            <span className="home-cta__spacer" aria-hidden="true" />
            {settings.tourLink && (
              <Button
                variant="accent"
                as="a"
                to={settings.tourLink}
                {...(/^https?:\/\//.test(settings.tourLink)
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                Walk the campus
              </Button>
            )}
          </motion.div>
          <motion.div className="home-cta__panel" {...reveal(0.12)}>
            <img
              className="home-cta__photo"
              src={`${import.meta.env.BASE_URL}home/science-forum.jpg`}
              alt=""
              loading="lazy"
            />
            <p className="home-eyebrow">For students</p>
            <h2 className="home-title">Student resources</h2>
            <p className="home-body">
              Time table, syllabus, homework and CBSE results for the current
              session, in one place.
            </p>
            <span className="home-cta__spacer" aria-hidden="true" />
            <Button variant="secondary" as="a" to="/students">
              Open resources
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
