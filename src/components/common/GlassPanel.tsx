import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  variant?: 'light' | 'dark' | 'default';
  className?: string;
}

export default function GlassPanel({
  children,
  variant = 'default',
  className = '',
}: GlassPanelProps) {
  const variantClass = {
    default: 'glass',
    light: 'glass-light',
    dark: 'glass-dark',
  }[variant];

  return (
    <div className={`relative isolate overflow-hidden ${variantClass} ${className}`}>
      {children}
    </div>
  );
}
