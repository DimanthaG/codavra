'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PixelButtonProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function PixelButton({ 
  children, 
  size = 'md', 
  onClick,
  className 
}: PixelButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'pixel-button border-2 border-black bg-white font-bold transition-colors hover:bg-black hover:text-white',
        sizes[size],
        className
      )}
    >
      {children}
    </motion.button>
  );
} 