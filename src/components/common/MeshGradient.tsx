import { useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface MeshGradientProps {
  className?: string;
}

export default function MeshGradient({ className = '' }: MeshGradientProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const translateX = useTransform(springX, (v) => `${v * 20}px`);
  const translateY = useTransform(springY, (v) => `${v * 20}px`);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX / innerWidth - 0.5);
      mouseY.set(clientY / innerHeight - 0.5);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      className={`absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-50 ${className}`}
    >
      <motion.div
        style={{ x: translateX, y: translateY }}
        className="relative w-[150%] h-[150%] -left-[25%] -top-[25%]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-transparent to-obsidian/40 blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-marigold-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </motion.div>
    </div>
  );
}
