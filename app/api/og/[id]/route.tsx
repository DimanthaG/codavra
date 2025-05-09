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
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#b45309',
          backgroundImage: 'linear-gradient(135deg, #854d0e 0%, #a16207 25%, #ca8a04 50%, #eab308 75%, #facc15 100%)',
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
          <div style={{ fontSize: 48, fontWeight: 'bold', lineHeight: 1.2, marginBottom: 20 }}>
            {decodeURIComponent(title)}
          </div>
          
          <div style={{ fontSize: 36, marginTop: 10, marginBottom: 10, color: 'rgba(255,255,255,0.9)' }}>
            {decodeURIComponent(organizer)} has invited you
          </div>

          <div style={{ fontSize: 24, marginTop: 20, color: 'rgba(255,255,255,0.8)' }}>
            {decodeURIComponent(description)}
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