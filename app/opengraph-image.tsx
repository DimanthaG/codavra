import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';
export const revalidate = 0;
export const dynamic = 'force-dynamic';

// Image metadata
export const alt = 'Codavra';
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
          backgroundImage: 'url(https://www.codavra.com/image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 0 30px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 'bold', marginBottom: 20 }}>
            Codavra
          </div>
          
          <div style={{ fontSize: 36, opacity: 0.9, fontWeight: 'normal' }}>
            We Craft Websites That Grow with You
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        'Cache-Control': 'no-cache, no-store',
        'Content-Type': 'image/png',
      }
    }
  );
} 