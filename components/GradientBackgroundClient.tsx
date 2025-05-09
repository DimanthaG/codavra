'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const GradientBackground = dynamic(() => import('@/components/GradientBackground'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-800 via-amber-600 to-red-500" />
  )
});

export default function GradientBackgroundClient() {
  // Track component mount state for transition effects
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div 
      className="transition-opacity duration-500"
      style={{ 
        opacity: isMounted ? 1 : 0
      }}
    >
      <GradientBackground />
    </div>
  );
} 