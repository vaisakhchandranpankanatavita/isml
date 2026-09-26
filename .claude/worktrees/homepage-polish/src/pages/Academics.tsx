import { motion } from 'framer-motion';
import PageHero from '@/components/common/PageHero';
import SectionHeading from '@/components/common/SectionHeading';
import Media from '@/components/common/Media';
import GlobalAtmosphere from '@/components/common/GlobalAtmosphere';
import PerspectiveCard from '@/components/common/PerspectiveCard';
import TextTrack from '@/components/common/TextTrack';
import { usePage } from '@/hooks/usePage';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function Academics() {
  const page = usePage('academics');
  const { settings } = useSiteSettings();
  const programs = settings.k12Programs;

  return (
    <GlobalAtmosphere>
      <PageHero
        title={page?.title ?? 'Academics'}
        subtitle="A CBSE curriculum from Kindergarten through Grade 12."
      />

      {page?.content && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="section"
        >
          <div className="container">
            <div className="cms-prose">{page.content}</div>
          </div>
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="section-lg"
      >
        <TextTrack text="EXCELLENCE" />
        <div className="container">
          <SectionHeading
            eyebrow="Curriculum"
            title={settings.k12Heading || 'Kindergarten to Grade 12'}
            ruled
          />
          <p className="body-copy mt-6">
            Each stage is built on the one before it, so a student who joins in Kindergarten
            never meets a seam.
          </p>

          {programs.length > 0 ? (
            <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {programs.map((p) => (
                <PerspectiveCard key={p.id}>
                  <article className="h-full">
                    <div className="story__media">
                      <Media src={p.coverUrl} alt={p.title} />
                    </div>
                    <p className="story__cat">{p.grades}</p>
                    <h3 className="story__title">{p.title}</h3>
                  </article>
                </PerspectiveCard>
              ))}
            </div>
          ) : (
            <p className="body-copy mt-10">
              No programmes have been added yet. Add them in Settings and they will appear here
              and on the homepage.
            </p>
          )}
        </div>
      </motion.section>
    </GlobalAtmosphere>
  );
}
