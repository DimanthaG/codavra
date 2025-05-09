'use client';

import { useParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

// This component adds additional meta tags specifically for WhatsApp
export default function MeetingHead() {
  const params = useParams();
  
  // Force WhatsApp to re-fetch metadata by using client-side injection
  useEffect(() => {
    // Dynamically update tags that might help with WhatsApp rendering
    const metaTags = [
      { property: 'og:site_name', content: 'Codavra' },
      { property: 'og:url', content: `https://www.codavra.com/meeting/${params.id}` },
      { property: 'og:type', content: 'website' },
      
      // WhatsApp-specific tags (might help)
      { property: 'al:web:url', content: `https://www.codavra.com/meeting/${params.id}` },
      { property: 'al:android:url', content: `https://www.codavra.com/meeting/${params.id}` },
      { property: 'al:ios:url', content: `https://www.codavra.com/meeting/${params.id}` },
      
      // Force large image format
      { name: 'twitter:card', content: 'summary_large_image' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
    ];
    
    // Add meta tags to head
    metaTags.forEach(tag => {
      const existingTag = document.querySelector(`meta[${Object.keys(tag)[0]}="${Object.values(tag)[0]}"]`);
      if (!existingTag) {
        const meta = document.createElement('meta');
        Object.entries(tag).forEach(([key, value]) => {
          meta.setAttribute(key, value as string);
        });
        document.head.appendChild(meta);
      }
    });
  }, [params.id]);
  
  return (
    <>
      {/* This script forces WhatsApp to re-scrape your URL */}
      <Script id="whatsapp-refresh" strategy="afterInteractive">{`
        // Send empty message to parent to potentially trigger WhatsApp's scraper
        if (window.parent !== window) {
          window.parent.postMessage('refresh-metadata', '*');
        }
      `}</Script>
    </>
  );
} 