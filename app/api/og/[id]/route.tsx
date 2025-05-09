import React from 'react';
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const searchParams = request.nextUrl.searchParams;
  
  // Get meeting data from query parameters
  const title = searchParams.get('title') || 'Meeting Invitation';
  const organizer = searchParams.get('organizer') || 'Someone';
  const description = searchParams.get('description') || 'Join this meeting';
  
  // Generate OpenGraph image with meeting details
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
        }}
      >
        {/* Top section with gold gradient and invitation */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#b45309',
            backgroundImage: 'linear-gradient(135deg, #854d0e 0%, #a16207 25%, #ca8a04 50%, #eab308 75%, #facc15 100%)',
            color: 'white',
            padding: '40px',
            textAlign: 'center',
            height: '65%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              width: '80%',
              backgroundColor: 'rgba(0,0,0,0.7)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 0 30px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 'bold', lineHeight: 1.2, marginBottom: 10 }}>
              Meeting Invitation
            </div>
            
            <div style={{ fontSize: 24, marginTop: 10, marginBottom: 5, color: 'rgba(255,255,255,0.9)' }}>
              You've been invited to join a meeting
            </div>

            <div style={{ fontSize: 16, marginTop: 10, color: 'rgba(255,255,255,0.8)' }}>
              Click to join on Codavra
            </div>
          </div>
        </div>

        {/* Bottom section with teal/green background and meeting details */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#065f46',
            color: 'white',
            padding: '30px',
            height: '35%',
          }}
        >
          <div style={{ fontSize: 30, fontWeight: 'bold', lineHeight: 1.2, marginBottom: 5 }}>
            {decodeURIComponent(organizer)} has invited you to {decodeURIComponent(title)}
          </div>
          
          <div style={{ fontSize: 20, marginTop: 10, color: 'rgba(255,255,255,0.9)' }}>
            {decodeURIComponent(description)}
          </div>

          <div style={{ fontSize: 16, marginTop: 10, color: 'rgba(255,255,255,0.7)' }}>
            www.codavra.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store',
      }
    }
  );
} 