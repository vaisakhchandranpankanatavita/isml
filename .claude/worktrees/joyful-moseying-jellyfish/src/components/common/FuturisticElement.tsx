import { motion } from 'framer-motion';

interface FuturisticElementProps {
  className?: string;
  delay?: number;
  speed?: number;
}

export default function FuturisticElement({
  className = '',
  delay = 0,
  speed = 20,
}: FuturisticElementProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.4, 0],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        delay,
        ease: 'linear',
      }}
      className={`absolute rounded-full bg-brand-500/20 blur-3xl ${className}`}
    />
  );
}
