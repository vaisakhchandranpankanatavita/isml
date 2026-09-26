import { useRef, type ReactNode, type TouchEvent, type MouseEvent } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface PerspectiveCardProps {
  children: ReactNode;
  className?: string;
}

export default function PerspectiveCard({ children, className = '' }: PerspectiveCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / (rect.width / 2));
    y.set((e.clientY - centerY) / (rect.height / 2));
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!ref.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((touch.clientX - centerX) / (rect.width / 2));
    y.set((touch.clientY - centerY) / (rect.height / 2));
  };

  const handleTouchEnd = () => {
    x.set(0);
    y.set(0);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative perspective-1000 ${className}`}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        className="w-full h-full transition-shadow duration-300 hover:shadow-2xl"
      >
        {children}
      </motion.div>
    </div>
  );
}
