import { motion, useReducedMotion } from 'framer-motion';
import Media from '@/components/common/Media';
import { Button } from '@/components/common/Button';

interface PrincipalMessageProps {
  message: string;
  name: string;
  title: string;
  imageUrl?: string;
  /** Full-bleed backdrop; the portrait is too small to fill the viewport sharply. */
  backgroundUrl?: string;
}

/**
 * The principal's message as a VCASS "BlockHeroCta": a full-height photo,
 * darkened from the left by a #1f1e1d gradient, with the quote set in the
 * serif italic accent, the name in condensed caps, and the call to action
 * pinned bottom-right. The portrait sits beside the name at its natural size
 * rather than as the backdrop, where a headshot would be upscaled to blur.
 */
export default function PrincipalMessage({ message, name, title, imageUrl, backgroundUrl }: PrincipalMessageProps) {
  const reduce = useReducedMotion();
  if (!message || !name || !title) return null;

  return (
    <section id="principal" className="band-dark relative isolate h-[100lvh] min-h-[640px] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Media src={backgroundUrl || imageUrl} alt="" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,30,29,0),rgba(31,30,29,0.85))] lg:right-auto lg:w-[60%] lg:bg-[linear-gradient(270deg,rgba(31,30,29,0),rgba(31,30,29,0.85))]"
        />
      </div>

      <div className="container flex h-full flex-col justify-end py-[clamp(5.25rem,4.3789rem+3.7267vw,9rem)] lg:grid lg:grid-cols-[1fr_auto] lg:grid-rows-[1fr_auto] lg:gap-10">
        <motion.p
          className="vc-label text-[#f59021] lg:col-span-2 lg:self-end"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          From the Principal
        </motion.p>
        <div className="mt-6 max-w-[46ch] lg:mt-0">
          <motion.blockquote
            className="vc-serif text-xl leading-snug text-neutral-1 md:text-2xl lg:text-3xl"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {message}
          </motion.blockquote>
          <div className="mt-8 flex items-center gap-5">
            {imageUrl && backgroundUrl && (
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-[#f59021] md:h-28 md:w-28">
                <Media src={imageUrl} alt={name} className="object-top" />
              </div>
            )}
            <div>
              <p className="font-display text-3xl font-extrabold uppercase leading-none text-neutral-3">{name}</p>
              <p className="vc-label mt-2 text-neutral-4">{title}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex items-end lg:mt-0 lg:justify-end">
          <Button variant="secondary" as="a" to="/about#principal">
            Read the full message
          </Button>
        </div>
      </div>
    </section>
  );
}
