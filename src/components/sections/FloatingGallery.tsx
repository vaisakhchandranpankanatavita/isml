import { motion, useReducedMotion } from "framer-motion";
import Media from "@/components/common/Media";
import { Button } from "@/components/common/Button";
import { useReveal } from "@/components/motion/reveal";
import type { HomeGalleryImage } from "@/types";

/**
 * "Experience @ISML": a dark band where the campus photos sit deep in the
 * background, dimmed and slowly zooming, under a vignette that pools the
 * darkness behind the one-line title. The CMS heading may contain line
 * breaks; they are collapsed so the title always reads on one line, and a
 * trailing word such as "@ISML" takes the gold serif accent.
 */
export default function FloatingGallery({
  images,
  heading,
  body,
}: {
  images: HomeGalleryImage[];
  heading: string;
  body?: string;
}) {
  const reduce = useReducedMotion();
  const reveal = useReveal();
  const photos = images.filter((image) => image.url);
  const mosaic = photos.length
    ? Array.from({ length: 6 }, (_, index) => photos[index % photos.length])
    : [];

  const words = heading.replace(/\\n|\n/g, " ").trim().split(/\s+/);
  const accent = words.length > 1 ? words.pop() : undefined;

  return (
    <section
      className="experience-mosaic relative isolate overflow-hidden"
      aria-labelledby="experience-title"
    >
      <div aria-hidden className="experience-mosaic__grid">
        {mosaic.map((image, index) => (
          <motion.div
            key={`${image.id}-${index}`}
            className="experience-mosaic__tile"
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: 1.2,
              delay: reduce ? 0 : index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="experience-mosaic__photo">
              <Media src={image.url} alt="" />
            </div>
          </motion.div>
        ))}
      </div>

      <div aria-hidden className="experience-mosaic__shade" />
      <div className="home-aura experience-mosaic__aura" aria-hidden="true">
        <span />
        <span />
      </div>

      <div className="experience-mosaic__inner container">
        <motion.div className="experience-mosaic__content" {...reveal(0.2)}>
          <p className="home-eyebrow">
            <span className="home-eyebrow__index">04</span> Life at ISML
          </p>
          <h2 id="experience-title" className="experience-mosaic__title">
            {words.join(" ")}
            {accent && (
              <>
                {" "}
                <span className="home-accent">{accent}</span>
              </>
            )}
          </h2>
          {body && <p className="experience-mosaic__body">{body}</p>}
          <Button variant="secondary" as="a" to="/gallery" className="mt-8">
            Explore the gallery
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
