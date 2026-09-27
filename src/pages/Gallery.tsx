import { useEffect, useRef, useState } from "react";
import PageHero from "@/components/common/PageHero";
import SectionHeading from "@/components/common/SectionHeading";
import Media from "@/components/common/Media";
import GlobalAtmosphere from "@/components/common/GlobalAtmosphere";
import { usePage } from "@/hooks/usePage";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Gallery() {
  const page = usePage("gallery");
  const { settings } = useSiteSettings();
  const images = settings.experienceImages.filter((img) => img.url);
  const [selectedImage, setSelectedImage] = useState<(typeof images)[number] | null>(null);
  const imagesRef = useRef(images);
  imagesRef.current = images;
  const selectedIndex = selectedImage
    ? images.findIndex((image) => image.id === selectedImage.id)
    : -1;

  useEffect(() => {
    if (!selectedImage) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null);
      if (event.key === "ArrowLeft" && imagesRef.current.length > 1) {
        const index = imagesRef.current.findIndex((image) => image.id === selectedImage.id);
        setSelectedImage(imagesRef.current[(index - 1 + imagesRef.current.length) % imagesRef.current.length]);
      }
      if (event.key === "ArrowRight" && imagesRef.current.length > 1) {
        const index = imagesRef.current.findIndex((image) => image.id === selectedImage.id);
        setSelectedImage(imagesRef.current[(index + 1) % imagesRef.current.length]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedImage]);

  useEffect(() => {
    if (selectedImage && selectedIndex < 0) setSelectedImage(null);
  }, [selectedImage, selectedIndex]);

  return (
    <div className="relative isolate min-h-screen bg-paper transition-colors duration-300">
      <GlobalAtmosphere />

      <PageHero
        title={page?.title ?? "Photo gallery"}
        subtitle={
          settings.experienceBody ||
          "Classrooms, fields and events across the school year."
        }
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
              <h2 className="text-xl font-display font-semibold">
                No photographs yet
              </h2>
              <p className="body-copy mt-3">
                Photographs added in Settings appear here. Until then the
                gallery stays empty rather than showing placeholders.
              </p>
            </div>
          </div>
        </section>
      ) : (
          <section className="section-lg">
            <div className="container">
              <SectionHeading eyebrow="Photo album" title="Campus life, in pictures" />
              <ul className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6">
                {images.map((img) => (
                  <li key={img.id} className="stagger-in min-w-0">
                    <figure>
                      <button
                        type="button"
                        className="group block w-full overflow-hidden rounded-lg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-red"
                        onClick={() => setSelectedImage(img)}
                        aria-label={`Open ${img.caption || "photograph"}`}
                      >
                        <div className="spotlight-card relative aspect-square overflow-hidden bg-paper-band">
                          <Media
                            src={img.url}
                            alt={
                              img.caption ||
                              "Photograph from the school gallery"
                            }
                          />
                          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />
                        </div>
                      </button>
                      {img.caption && (
                        <figcaption className="mt-1.5 truncate text-xs text-ink-soft sm:mt-2 sm:text-sm">
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  </li>
                ))}
              </ul>
            </div>
          </section>
      )}

      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.caption || "Gallery photograph"}
          className="fixed inset-0 z-[180] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          data-lenis-prevent
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedImage(null);
          }}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 px-4 py-2 text-2xl text-white hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
            aria-label="Close photograph"
          >
            ×
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 px-4 py-2 text-2xl text-white hover:bg-white/20 sm:left-6"
                onClick={() =>
                  setSelectedImage(images[(selectedIndex - 1 + images.length) % images.length])
                }
                aria-label="Previous photograph"
              >
                ‹
              </button>
              <button
                type="button"
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 px-4 py-2 text-2xl text-white hover:bg-white/20 sm:right-6"
                onClick={() =>
                  setSelectedImage(images[(selectedIndex + 1) % images.length])
                }
                aria-label="Next photograph"
              >
                ›
              </button>
            </>
          )}
          <figure className="flex max-h-full max-w-full flex-col items-center gap-3">
            <img
              src={selectedImage.url}
              alt={selectedImage.caption || "Photograph from the school gallery"}
              className="max-h-[78dvh] max-w-[min(92vw,76rem)] object-contain"
            />
            {selectedImage.caption && (
              <figcaption className="text-center text-sm text-white/85">
                {selectedImage.caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </div>
  );
}
