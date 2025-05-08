'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function GradientBackground() {
  const initialized = useRef(false);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.UnicornStudio) {
        try {
          window.UnicornStudio.destroy();
        } catch (error) {
          console.error('Error destroying UnicornStudio:', error);
        }
      }
    };
  }, []);

  return (
    <>
      <div 
        className="unicorn-embed"
        data-us-project-src="/js/flow-gradient.json"
        data-us-scale="1"
        data-us-dpi="1.5"
        data-us-production="1"
        data-us-watermark="false"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
      <Script
        id="unicorn-studio-script"
        strategy="afterInteractive"
        src="/js/unicornStudio.umd.js"
        onLoad={() => {
          if (typeof window !== 'undefined' && window.UnicornStudio && !initialized.current) {
            window.UnicornStudio.init({
              production: true,
              includeLogo: false
            })
              .then(() => {
                initialized.current = true;
                console.log('Unicorn Studio initialized');
              })
              .catch((error: unknown) => {
                console.error('Failed to initialize Unicorn Studio:', error);
              });
          }
        }}
      />
    </>
  );
} 