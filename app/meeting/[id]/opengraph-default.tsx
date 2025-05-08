import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';
export const dynamic = 'force-static';
export const revalidate = 0;

// Image metadata
export const alt = 'Meeting Invitation';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
          backgroundColor: '#111',
          backgroundSize: '400% 400%',
          color: 'white',
          padding: '40px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 10,
            maxWidth: '90%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ fontSize: 52, fontWeight: 'bold', marginBottom: 20 }}>
            You've been invited to a meeting
          </div>
          
          <div style={{ fontSize: 36, opacity: 0.9 }}>
            Click to view meeting details
          </div>
        </div>
        
        {/* Logo/Watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            left: 30,
            fontSize: 24,
            opacity: 0.7,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white" style={{ marginRight: 10 }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
          </svg>
          Codavra Meeting
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Content-Type': 'image/png',
      }
    }
  );
} 