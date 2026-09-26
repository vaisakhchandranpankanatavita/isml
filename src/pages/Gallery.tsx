import PageHero from '@/components/common/PageHero';
import SectionHeading from '@/components/common/SectionHeading';
import Media from '@/components/common/Media';
import HorizontalScrollSection from '@/components/motion/HorizontalScrollSection';
import PerspectiveCard from '@/components/common/PerspectiveCard';
import GlobalAtmosphere from '@/components/common/GlobalAtmosphere';
import { usePage } from '@/hooks/usePage';
import { useSiteSettings } from '@/hooks/useSiteSettings';

/** How many photographs lead the horizontal highlights sweep before the full grid takes over. */
const HIGHLIGHT_COUNT = 8;

export default function Gallery() {
  const page = usePage('gallery');
  const { settings } = useSiteSettings();
  const images = settings.experienceImages.filter((img) => img.url);

  const showHighlights = images.length > HIGHLIGHT_COUNT;
  const highlights = images.slice(0, HIGHLIGHT_COUNT);

  return (
    <div className="relative isolate min-h-screen bg-paper transition-colors duration-300">
      <GlobalAtmosphere />

      <PageHero
        title={page?.title ?? 'Photo gallery'}
        subtitle={settings.experienceBody || 'Classrooms, fields and events across the school year.'}
      />

      {page?.content && (
        <section className="section">
          <div className="container">
            <div className="cms-prose">{page.content}</div>
          </div>
        </section>
      )}

      {images.length === 0 ? (
        <section className="section-lg">
          <div className="container">
            <div className="max-w-measure">
              <h2 className="text-xl font-display font-semibold">No photographs yet</h2>
              <p className="body-copy mt-3">
                Photographs added in Settings appear here. Until then the gallery stays empty
                rather than showing placeholders.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <>
          {showHighlights && (
            <section className="section-lg snap-section">
              <div className="container">
                <SectionHeading eyebrow="Highlights" title="A year, in passing" />
              </div>
              <HorizontalScrollSection className="container mt-10">
                {highlights.map((img) => (
                  <figure key={img.id} className="w-[78vw] shrink-0 sm:w-80">
                    <PerspectiveCard>
                      <div className="spotlight-card relative aspect-[4/3] overflow-hidden bg-paper-band group">
                        <Media
                          src={img.url}
                          alt={img.caption || 'Photograph from the school gallery'}
                         
                        />
                        <div className="absolute inset-0 flex items-end justify-center p-6 opacity-0 transition-all duration-500 group-hover:opacity-100 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent">
                          <p className="text-center text-xs leading-relaxed text-white translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                            {img.caption}
                          </p>
                        </div>
                      </div>
                    </PerspectiveCard>
                  </figure>
                ))}
              </HorizontalScrollSection>
            </section>
          )}

          <section className="section-lg snap-section">
            <div className="container">
              {showHighlights && <p className="rule-label">All photographs</p>}
              <ul className={`mt-8 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4 ${showHighlights ? '' : ''}`}>
                {images.map((img) => (
                  <li key={img.id} className="stagger-in">
                    <figure>
                      <PerspectiveCard>
                        <div className="spotlight-card relative aspect-[4/3] overflow-hidden bg-paper-band group">
                          <Media
                            src={img.url}
                            alt={img.caption || 'Photograph from the school gallery'}
                           
                          />
                          <div className="absolute inset-0 flex items-end justify-center p-6 opacity-0 transition-all duration-500 group-hover:opacity-100 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent">
                            <p className="text-center text-xs leading-relaxed text-white translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                              {img.caption}
                            </p>
                          </div>
                        </div>
                      </PerspectiveCard>
                    </figure>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
