'use client';

import { useState } from 'react';

interface WhatsAppShareButtonProps {
  meetingId: string;
  title: string;
  description?: string;
}

export default function WhatsAppShareButton({ 
  meetingId, 
  title, 
  description = "Join this meeting" 
}: WhatsAppShareButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Handle sharing directly to WhatsApp with timestamped URL to prevent caching

  
  // Handle native sharing for mobile devices
  const handleNativeShare = async () => {
    // Check if Web Share API is available
    
    
    // Create timestamp URL
    const baseUrl = 'https://www.codavra.com';
    const timestamp = Date.now();
    const shareUrl = `${baseUrl}/meeting/${meetingId}?t=${timestamp}`;
    
    try {
      await navigator.share({
        title: title,
        text: description,
        url: shareUrl,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      
    }
  };
  
  // Handle copying the link to clipboard
  const handleCopyLink = async () => {
    const baseUrl = 'https://www.codavra.com';
    const shareUrl = `${baseUrl}/meeting/${meetingId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  // Check if running on the client side and if Web Share API is available
  const hasShareApi = typeof navigator !== 'undefined' && !!navigator.share;
  
  return (
    <div className="flex flex-wrap gap-2">
      {/* Main WhatsApp Share Button */}
      
      
      {/* Native Share button - Mobile friendly */}
      {hasShareApi && (
        <button
          onClick={handleNativeShare}
          className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-1 transition-colors text-sm sm:text-base sm:px-4"
          aria-label="Share using device"
          data-share="native"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          <span className="hidden sm:inline">Share</span>
        </button>
      )}
      
      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-1 transition-colors relative text-sm sm:text-base sm:px-4"
        aria-label="Copy link"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="flex-shrink-0"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        <span className="hidden sm:inline">Copy Link</span>
        {showTooltip && (
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-75">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
} 