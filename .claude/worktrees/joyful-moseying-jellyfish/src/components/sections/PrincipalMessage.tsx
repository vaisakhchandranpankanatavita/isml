import React from 'react';
import { motion } from 'framer-motion';
import GlassPanel from '@/components/common/GlassPanel';
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

          className="h-full w-full object-cover opacity-60"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent"
        />
      </motion.div>

      <div className="container relative z-10">
        <div className="max-w-3xl">
          <GlassPanel variant="dark" className="p-8 md:p-12">
            <p className="rule-label rule-label--light">From the Principal</p>
            <blockquote className="voice mt-7 text-white md:text-2xl leading-relaxed">
              {message}
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px w-8 bg-brand-600" />
              <div>
                <p className="font-display text-base font-semibold text-white">{name}</p>
                <p className="text-sm text-white/65">{title}</p>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </section>
  );
}
