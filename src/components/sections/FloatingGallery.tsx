import { motion, useReducedMotion } from 'framer-motion';
import Media from '@/components/common/Media';
import { Button } from '@/components/common/Button';
import type { HomeGalleryImage } from '@/types';

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
  const photos = images.filter((image) => image.url);
  const mosaic = photos.length
    ? Array.from({ length: 6 }, (_, index) => photos[index % photos.length])
    : [];

  return (
    <section className="experience-mosaic relative isolate min-h-[760px] overflow-hidden md:min-h-[720px] md:h-[100svh]">
      <div
        aria-hidden
        className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-1 md:grid-cols-3 md:grid-rows-2"
      >
        {mosaic.map((image, index) => (
          <motion.div
            key={`${image.id}-${index}`}
            className="group relative min-h-0 overflow-hidden bg-neutral-6"
            initial={reduce ? false : { opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, delay: reduce ? 0 : index * 0.08, ease: 'easeOut' }}
          >
            <div className="experience-mosaic__photo absolute inset-0">
              <Media src={image.url} alt="" />
            </div>
            <div className="absolute inset-0 bg-black/15 transition-colors duration-500 group-hover:bg-black/5" />
          </motion.div>
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/30 to-black/55"
      />

      <div className="relative z-10 flex min-h-[760px] items-center justify-center px-5 py-24 md:h-full md:min-h-0 md:px-8">
        <motion.div
          className="experience-mosaic__content w-full max-w-3xl rounded-2xl px-5 py-9 text-center sm:px-10 sm:py-12 md:px-14 md:py-14"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, delay: 0.2, ease: 'easeOut' }}
        >
          <p className="mb-4 font-display text-xs font-bold uppercase tracking-[0.2em] text-amber-300 sm:text-sm">
            Life at ISML
          </p>
          <h2 className="mx-auto max-w-[18ch] text-balance text-[clamp(2rem,4vw,3rem)] leading-[0.94] tracking-[-0.025em] text-white">
            {heading}
          </h2>
          {body && (
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
              {body}
            </p>
          )}
          <Button variant="secondary" as="a" to="/gallery" className="mt-6">
            Explore the gallery
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
