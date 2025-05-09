import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  
  // Generate a simple OpenGraph image with a nice gradient
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
          backgroundColor: '#392100',
          backgroundImage: 'linear-gradient(135deg, #392100 0%, #644000 20%, #98610D 40%, #CE8D16 60%, #FFB340 80%, #FFEFD9 100%)',
          color: 'white',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            width: '90%',
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 0 30px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ fontSize: 54, fontWeight: 'bold', lineHeight: 1.2, marginBottom: 20 }}>
            Meeting Invitation
          </div>
          
          <div style={{ fontSize: 36, marginTop: 10, marginBottom: 10, color: 'rgba(255,255,255,0.9)' }}>
            You've been invited to join a meeting
          </div>

          <div style={{ fontSize: 24, marginTop: 20, color: 'rgba(255,255,255,0.8)' }}>
            Click to join on Codavra
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
      }
    }
  );
} 