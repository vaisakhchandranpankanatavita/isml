import { motion } from 'framer-motion';
import Media from '@/components/common/Media';

interface PrincipalMessageProps {
  message: string;
  name: string;
  title: string;
  imageUrl?: string;
}

export default function PrincipalMessage({
  message,
  name,
  title,
  imageUrl,
}: PrincipalMessageProps) {
  return (
    <section
      id="principal"
      className="snap-section relative isolate flex flex-col justify-center bg-obsidian overflow-hidden"
    >
      {/* Background with subtle parallax */}
      {/* Animated background glow for depth */}
      <motion.div
        className="absolute inset-0 -z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(52, 217, 118, 0.12) 0%, transparent 70%)',
          }}
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ scale: 1 }}
        whileInView={{ scale: 1.1 }}
        transition={{ duration: 10, ease: 'linear' }}
        viewport={{ once: true }}
      >
        <Media
          src={imageUrl}
          alt=""

          className="h-full w-full object-cover opacity-50"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/60 to-transparent"
        />
      </motion.div>

      <div className="container relative z-10">
        <div className="max-w-3xl">
          <div className="border border-paper-line bg-paper-light p-8 md:p-12">
            <p className="sys-tag text-ink-muted">
              <span></span>
              Principal / Message
            </p>
            <span aria-hidden className="mt-4 block font-display text-6xl leading-none text-marigold-500">
              &ldquo;
            </span>
            <blockquote className="voice -mt-4 text-ink md:text-2xl leading-relaxed">
              {message}
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px w-8 bg-marigold-500" />
              <div>
                <p className="font-display text-base font-semibold text-ink">{name}</p>
                <p className="text-sm text-ink-muted">{title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
