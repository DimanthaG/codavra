'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PixelTextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'p';
  animate?: boolean;
  className?: string;
}

const variants = {
  h1: 'text-4xl md:text-5xl font-bold',
  h2: 'text-3xl md:text-4xl font-bold',
  h3: 'text-2xl md:text-3xl font-bold',
  p: 'text-base md:text-lg',
};

export default function PixelText({ 
  children, 
  variant = 'p', 
  animate = false,
  className 
}: PixelTextProps) {
  const Component = variant === 'p' ? 'p' : variant;
  const baseClasses = cn('pixel-text', variants[variant], className);

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={baseClasses}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <Component className={baseClasses}>
      {children}
    </Component>
  );
} 