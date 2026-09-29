import { useEffect, useState } from "react";
import HeroPin from "@/components/home/HeroPin";
import { Story, Principal } from "@/components/home/StorySections";
import StackedPrograms from "@/components/home/StackedPrograms";
import ExperienceMarquee from "@/components/home/ExperienceMarquee";
import NewsList from "@/components/home/NewsList";
import { Pillars, QuickLinks, GetInTouch } from "@/components/home/Highlights";
import AdmissionsCta from "@/components/home/AdmissionsCta";
import { SectionBoundary } from "@/components/common/SectionBoundary";
import { postsService } from "@/services/cms.service";
import { storage } from "@/services/storage";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import type { Post } from "@/types";

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
 * Home: pinned expanding-video hero, then story, principal, stacked
 * programme cards, photo marquees, news and the admissions close. All
 * `data-r` reveals are driven by `useReferenceMotion` in PublicLayout.
 */
export default function Home() {
  const { settings } = useSiteSettings();
  const posts = usePublishedPosts();
  const photos = settings.experienceImages.filter((img) => img.url);
  const tourLink = settings.tourLink && settings.tourLink !== "#tour" ? settings.tourLink : "/gallery";

  return (
    <div>
      <SectionBoundary fallback={<div className="py-20 text-center text-ink-muted">Unable to load this section.</div>}>
        <HeroPin />
      </SectionBoundary>

      <Story />

      <SectionBoundary fallback={null}>
        <Principal
          message={settings.principalMessage}
          name={settings.principalName}
          title={settings.principalTitle}
          imageUrl={settings.principalImageUrl || "/home/principal.jpg"}
        />
      </SectionBoundary>

      <Pillars />

      <StackedPrograms programs={settings.k12Programs} />

      <ExperienceMarquee
        heading={settings.experienceHeading || "Experience @ ISML"}
        body={settings.experienceBody}
        images={photos}
      />

      <NewsList posts={posts.slice(0, 6)} />

      <QuickLinks />

      <GetInTouch address={settings.contactAddress} phone={settings.contactPhone} emails={settings.contactEmails} />

      <AdmissionsCta tourHeading={settings.tourHeading} tourBody={settings.tourBody} tourLink={tourLink} />
    </div>
  );
}
