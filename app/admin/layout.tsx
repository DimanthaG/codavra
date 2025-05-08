'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const GradientBackground = dynamic(() => import('@/components/GradientBackground'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 to-blue-900" />
  )
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Add a fade-in effect for the children content
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Persistent gradient background that doesn't reload between navigations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <GradientBackground />
      </div>
      
      {/* Wrap children in a transition container */}
      <div 
        className="transition-opacity duration-300"
        style={{ 
          opacity: isMounted ? 1 : 0
        }}
      >
        {children}
      </div>
    </div>
  );
} 