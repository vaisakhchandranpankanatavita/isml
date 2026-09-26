import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface CountUpProps {
  value: number;
  className?: string;
  /** False for values like years that shouldn't get thousands separators. */
  grouped?: boolean;
}

export default function CountUp({ value, className = '', grouped = true }: CountUpProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const duration = 2; // seconds
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        const currentValue = Math.floor(progress * value);
        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, value]);

  return (
    <motion.span ref={ref} className={className}>
      {grouped ? count.toLocaleString() : count}
    </motion.span>
  );
}
