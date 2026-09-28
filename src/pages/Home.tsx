import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReveal } from "@/components/motion/reveal";
import Hero from "@/components/sections/Hero";
import OurStory from "@/components/sections/OurStory";
import ProgramGrid from "@/components/sections/ProgramGrid";
import FloatingGallery from "@/components/sections/FloatingGallery";
import NewsCarousel from "@/components/sections/NewsCarousel";
import PrincipalMessage from "@/components/sections/PrincipalMessage";
import { postsService } from "@/services/cms.service";
import { storage } from "@/services/storage";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import type { Post } from "@/types";
import { Button } from "@/components/common/Button";
import { SectionBoundary } from "@/components/common/SectionBoundary";
import { Link } from "react-router-dom";

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
 * Homepage sections use a shared editorial design system while retaining
 * CMS-managed school content and site settings.
 */
export default function Home() {
  const { settings } = useSiteSettings();
  const posts = usePublishedPosts();
  const reveal = useReveal();
  const photos = settings.experienceImages.filter((img) => img.url);
  const tourLink =
    settings.tourLink && settings.tourLink !== "#tour"
      ? settings.tourLink
      : "/gallery";

  return (
    <div className="site-home">
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
          images={photos}
          heading={settings.experienceHeading || "Experience @ ISML"}
          body={settings.experienceBody}
        />
      )}

      <NewsCarousel posts={posts.slice(0, 8)} />

      <section
        className="home-section home-section--night home-cta"
        aria-labelledby="home-cta-title"
      >
        <div className="container home-cta__grid">
          <motion.div className="home-cta__admissions" {...reveal()}>
            <p className="home-eyebrow">Admissions · 2026–27</p>
            <h2 id="home-cta-title" className="home-title">
              Let’s find the right next step.
            </h2>
            <p className="home-body">
              Tell us your child’s grade and the admissions team will help you
              understand the process.
            </p>
            <Button
              variant="accent"
              as="a"
              to="/admissions#enquire"
              className="mt-7"
            >
              Enquire about admissions
            </Button>
          </motion.div>
          <motion.div className="home-cta__visit" {...reveal(0.12)}>
            <p className="home-eyebrow">Come see for yourself</p>
            <h3 className="home-title">
              {settings.tourHeading || "Explore the campus"}
            </h3>
            {settings.tourBody && (
              <p className="home-body">{settings.tourBody}</p>
            )}
            <Button
              variant="secondary"
              as="a"
              to={tourLink}
              {...(/^https?:\/\//.test(tourLink)
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
              className="mt-7"
            >
              Explore the campus
            </Button>
            <Link className="home-cta__student-link" to="/students">
              Student resources <span aria-hidden="true">↗</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
