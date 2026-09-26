import { motion, useReducedMotion } from 'framer-motion';
import Media from '@/components/common/Media';
import { Button } from '@/components/common/Button';

interface PrincipalMessageProps {
  message: string;
  name: string;
  title: string;
  imageUrl?: string;
}

/**
 * The principal's message on the dark band: the quote set in a handwritten
 * face with the name in condensed caps, beside the principal's
 * portrait. The portrait is framed at no more than its natural width
 * (440px) so it stays sharp instead of being stretched across the viewport.
 */
export default function PrincipalMessage({ message, name, title, imageUrl }: PrincipalMessageProps) {
  const reduce = useReducedMotion();
  if (!message || !name || !title) return null;

  return (
    <section id="principal" className="band-dark relative isolate overflow-hidden">
      <div className="container grid items-center gap-12 py-[clamp(5.25rem,4.3789rem+3.7267vw,9rem)] lg:grid-cols-[1fr_minmax(0,440px)] lg:gap-20">
        <div className="max-w-[46ch]">
          <motion.p
            className="vc-label text-[#f59021]"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            From the Principal
          </motion.p>
          <motion.blockquote
            className="mt-6 font-hand text-xl leading-[1.6] text-neutral-1 md:text-2xl lg:text-[1.75rem]"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {message}
          </motion.blockquote>
          <p className="mt-8 font-display text-3xl font-extrabold uppercase leading-none text-neutral-3">
            {name}
          </p>
          <p className="vc-label mt-2 text-neutral-4">{title}</p>
          <div className="mt-8">
            <Button variant="secondary" as="a" to="/about#principal">
              Read the full message
            </Button>
          </div>
        </div>

        {imageUrl && (
          <motion.figure
            className="relative mx-auto aspect-[440/467] w-full max-w-[440px] overflow-hidden rounded-[8px]"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <Media src={imageUrl} alt={`${name}, ${title}`} className="object-top" />
          </motion.figure>
        )}
      </div>
    </section>
  );
}
