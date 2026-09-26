import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInvertHover } from '@/hooks/useInvertHover';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'on-image' | 'red' | 'gold';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  as?: 'a' | 'button';
  to?: string; // For Link (as='a')
  className?: string;
}

/**
 * Modernized Button component for ISML.
 * Replaces raw .btn classes with a unified component that encapsulates:
 * 1. Visibility improvements (higher contrast, subtle depth)
 * 2. Tactile micro-interactions (scale, spring physics)
 * 3. Organic flood-fill (cursor-anchored entry point)
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  as = 'button',
  to,
  className,
  ...props
}) => {
  const onInvertHover = useInvertHover();

  const variants = {
    primary:
      'border-marigold-500 text-marigold-500 bg-transparent hover:bg-marigold-500/10 focus-visible:ring-marigold-500',
    outline:
      'border-ink/30 text-ink bg-transparent hover:bg-ink/5 focus-visible:ring-marigold-500',
    ghost:
      'border-transparent text-ink-soft bg-transparent hover:bg-ink/5 hover:text-ink focus-visible:ring-marigold-500',
    'on-image':
      'border-white/60 text-white bg-white/12 backdrop-blur-md hover:bg-white/20 focus-visible:ring-white/80',
    red: 'border-clay-500 text-white bg-clay-500 hover:bg-clay-700 focus-visible:ring-clay-500',
    gold: 'border-marigold-500 text-white bg-marigold-500 hover:bg-marigold-600 focus-visible:ring-marigold-500',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
  };

  const baseStyles =
    'inline-flex items-center justify-center gap-2 border bg-transparent font-medium transition-colors duration-300 focus:outline-none relative isolate overflow-hidden';

  // The flood-fill effect logic - only for outline/ghost variants that need it
  const needsInvert = variant === 'outline' || variant === 'ghost';
  const invertStyles = needsInvert ? 'btn-invert' : '';

  const combinedClassName = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    invertStyles,
    className,
  );

  // Common motion props for all buttons
  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 400, damping: 25 } as const,
    ...props,
  };

  const handlePointerEnter = (e: React.PointerEvent<any>) => {
    onInvertHover(e);
  };

  if (as === 'a' && to) {
    return (
      <motion.div
        className={combinedClassName}
        onPointerEnter={handlePointerEnter}
        {...motionProps}
      >
        <Link to={to} className="contents">
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      className={combinedClassName}
      onPointerEnter={handlePointerEnter}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
};
