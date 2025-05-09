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
  const handleWhatsAppShare = () => {
    // Create WhatsApp-friendly URL with timestamp to prevent cache
    const baseUrl = 'https://www.codavra.com';
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    
    // Create URL with query parameters that will be ignored by your app but prevent caching
    const shareUrl = `${baseUrl}/meeting/${meetingId}?wats=${timestamp}&r=${random}`;
    
    // Format text for WhatsApp
    const shareText = `${title}\n\n${description}\n\n`;
    
    // Create WhatsApp URL
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + shareUrl)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };
  
  // Handle native sharing for mobile devices
  const handleNativeShare = async () => {
    if (!navigator.share) return handleWhatsAppShare();
    
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
      // Fallback to WhatsApp share
      handleWhatsAppShare();
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
  
  return (
    <div className="flex gap-2">
      {/* Main WhatsApp Share Button */}
      <button
        onClick={handleWhatsAppShare}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        aria-label="Share on WhatsApp"
        data-share="whatsapp"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        WhatsApp
      </button>
      
      {/* Native Share button - Mobile friendly */}
      {navigator.share && (
        <button
          onClick={handleNativeShare}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          aria-label="Share using device"
          data-share="native"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          Share
        </button>
      )}
      
      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors relative"
        aria-label="Copy link"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        Copy Link
        {showTooltip && (
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-75">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
} 