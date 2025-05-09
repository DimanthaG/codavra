'use client';

import { useParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

// This component adds additional meta tags specifically for WhatsApp
export default function MeetingHead() {
  const params = useParams();
  
  // Force WhatsApp to re-fetch metadata by using client-side injection
  useEffect(() => {
    // Get base URL - ensure it's absolute with protocol
    const baseUrl = 'https://www.codavra.com';
    const meetingUrl = `${baseUrl}/meeting/${params.id}`;
    
    // Generate timestamp and random value to prevent caching
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);
    
    // Get Supabase URL from meta tag (fallback to default if not found)
    const supabaseUrlMeta = document.querySelector('meta[name="supabase-url"]');
    const supabaseUrl = supabaseUrlMeta ? supabaseUrlMeta.getAttribute('content') : '';
    
    // Try to get existing OG image URL from meta tag
    const existingOgImage = document.querySelector('meta[property="og:image"]');
    const ogImageBase = existingOgImage ? existingOgImage.getAttribute('content') : '';
    
    // If we have an OG image URL, add cache-busting parameters
    let ogImageUrl = ogImageBase;
    if (ogImageUrl && !ogImageUrl.includes('t=')) {
      // Add timestamp and random value to URL
      const separator = ogImageUrl.includes('?') ? '&' : '?';
      ogImageUrl = `${ogImageUrl}${separator}t=${timestamp}&r=${random}`;
    }
    
    // Dynamically update tags that might help with WhatsApp rendering
    const metaTags = [
      // Core Open Graph tags
      { property: 'og:site_name', content: 'Codavra' },
      { property: 'og:url', content: meetingUrl },
      { property: 'og:type', content: 'website' },
      
      // Image specific tags
      { property: 'og:image', content: ogImageUrl },
      { property: 'og:image:secure_url', content: ogImageUrl },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '628' }, // WhatsApp prefers 1.91:1 ratio (1200x628)
      { property: 'og:image:type', content: 'image/png' },
      { property: 'og:image:alt', content: 'Meeting Invitation' },
      
      // WhatsApp-specific tags
      { property: 'al:web:url', content: meetingUrl },
      { property: 'al:android:url', content: meetingUrl },
      { property: 'al:ios:url', content: meetingUrl },
      
      // Force large image format
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: ogImageUrl },
      
      // Other helpful tags
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'theme-color', content: '#f97316' },
    ];
    
    // Add meta tags to head
    metaTags.forEach(tag => {
      const selector = Object.keys(tag)[0] === 'name' 
        ? `meta[name="${Object.values(tag)[0]}"]`
        : `meta[property="${Object.values(tag)[0]}"]`;
        
      // Remove existing tag if it exists
      const existingTag = document.querySelector(selector);
      if (existingTag) {
        existingTag.remove();
      }
      
      // Create and add new tag
      const meta = document.createElement('meta');
      Object.entries(tag).forEach(([key, value]) => {
        meta.setAttribute(key, value as string);
      });
      document.head.appendChild(meta);
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
        
        // Force refresh of cached data
        if (navigator.share) {
          // Add an event listener for share button clicks
          document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.closest('[data-share]')) {
              // Update URL with timestamp before sharing
              const shareUrl = new URL(window.location.href);
              shareUrl.searchParams.set('t', Date.now().toString());
              
              // Use Web Share API
              navigator.share({
                title: document.title,
                text: document.querySelector('meta[name="description"]')?.getAttribute('content') || 'Join my meeting',
                url: shareUrl.toString()
              }).catch(err => console.warn('Share failed:', err));
              
              e.preventDefault();
            }
          });
        }
      `}</Script>
    </>
  );
} 