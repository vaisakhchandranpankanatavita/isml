import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface TextTrackProps {
  text: string;
  className?: string;
  direction?: 'left' | 'right';
}

export default function TextTrack({ text, className = '', direction = 'left' }: TextTrackProps) {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'left' ? ['10%', '-10%'] : ['-10%', '10%'],
  );

  return (
    <div ref={targetRef} className={`relative overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div style={{ x }} className="inline-block">
        {/* Duplicate text for seamless loop feel */}
        <span className="inline-block px-4">{text}</span>
        <span className="inline-block px-4">{text}</span>
        <span className="inline-block px-4">{text}</span>
        <span className="inline-block px-4">{text}</span>
      </motion.div>
    </div>
  );
}
