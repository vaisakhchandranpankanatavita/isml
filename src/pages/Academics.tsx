import PageHero from '@/components/common/PageHero';
import SectionHeading from '@/components/common/SectionHeading';
import Media from '@/components/common/Media';
import { usePage } from '@/hooks/usePage';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function Academics() {
  const page = usePage('academics');
  const { settings } = useSiteSettings();
  const programs = settings.k12Programs;

  return (
    <>
      <PageHero
        title={page?.title ?? 'Academics'}
        subtitle="A CBSE curriculum from Kindergarten through Grade 12."
      />

      {page?.content && (
        <section data-r="fade-up" data-delay="0.1"          className="section"
        >
          <div className="container">
            <div className="cms-prose">{page.content}</div>
          </div>
        </section>
      )}

      <section data-r="fade-up" data-delay="0.1"        className="section-lg"
      >
        <p aria-hidden data-r="fade" className="container overflow-hidden whitespace-nowrap font-display text-[clamp(5rem,20vw,18rem)] leading-[0.85] text-ink/10">EXCELLENCE</p>
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
                <div key={p.id}>
                  <article className="h-full">
                    <div className="story__media">
                      <Media src={p.coverUrl} alt={p.title} />
                    </div>
                    <p className="story__cat">{p.grades}</p>
                    <h3 className="story__title">{p.title}</h3>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <p className="body-copy mt-10">
              No programmes have been added yet. Add them in Settings and they will appear here
              and on the homepage.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
