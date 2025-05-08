'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import gradientConfig from './ui/flow-gradient.json';

// Use the existing declaration from global.d.ts
declare global {
  interface Window {
    UNICORN_INITIALIZED?: boolean;
  }
}

export default function FlowGradient() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.UnicornStudio) {
      // Initialize with stub methods until the real script loads
      window.UnicornStudio = { 
        isInitialized: false,
        init: (options?) => {
          console.warn('UnicornStudio not fully loaded yet');
          // Return a promise with an empty array that matches the expected return type
          return Promise.resolve([{
            element: document.createElement('div'),
            destroy: () => {},
            contains: () => false
          }]);
        },
        destroy: () => {
          console.warn('UnicornStudio not fully loaded yet');
        },
        addScene: (options) => {
          console.warn('UnicornStudio not fully loaded yet');
          return Promise.resolve({
            destroy: () => {},
            resize: () => {}
          });
        }
      };
    }
  }, []);

  return (
    <>
      <div 
        className="unicorn-embed"
        data-us-project={gradientConfig.id}
        data-us-scale="1"
        data-us-dpi="1.5"
        data-us-production="1"
        data-us-watermark="false"
        data-us-alttext="Gradient Background"
        data-us-arialabel="Interactive gradient background"
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
        id="unicorn-studio"
        strategy="afterInteractive"
        src="/js/unicornStudio.umd.js"
        onLoad={() => {
          if (!window.UNICORN_INITIALIZED && window.UnicornStudio) {
            try {
              // Pass options to init method
              window.UnicornStudio.init({
                production: true,
                includeLogo: false
              }).then(() => {
                window.UNICORN_INITIALIZED = true;
              });
            } catch (error) {
              console.error('Failed to initialize UnicornStudio:', error);
            }
          }
        }}
      />
    </>
  );
}