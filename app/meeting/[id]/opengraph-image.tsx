import { ImageResponse } from 'next/og';
import { supabase } from '@/utils/supabase';

// Route segment config
export const runtime = 'edge';
export const revalidate = 0;
export const dynamic = 'force-dynamic';

// Image metadata
export const alt = 'Meeting Invitation';
export const size = {
  width: 1200,
  height: 630,
};

// Set ContentType to PNG for better compatibility
export const contentType = 'image/png';

// Set cache control headers for better caching behavior
export async function generateImageMetadata() {
  return [
    {
      contentType: 'image/png',
      size: { width: 1200, height: 630 },
      id: 'opengraph-image'
    }
  ];
}

// Image generation
export default async function Image({ params }: { params: { id: string } }) {
  try {
    // Fetch meeting data
    const { data: meeting } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', params.id)
      .single();
    
    if (!meeting) {
      // Fallback image if meeting not found
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
                fontSize: 60, 
                fontWeight: 'bold',
                backgroundColor: 'rgba(0,0,0,0.6)',
                padding: '20px 40px',
                borderRadius: '12px',
              }}
            >
              Meeting Invitation
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

    // Format organizer name
    const organizerName = meeting.created_by_name || 'Someone';
    const meetingTitle = meeting.title || 'Meeting';
    
    // Create the complete invitation text that matches what's shown in metadata
    const inviteText = `${organizerName} has invited you to ${meetingTitle}`;
    
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
            {/* Full invitation text */}
            <div style={{ fontSize: 52, fontWeight: 'bold', lineHeight: 1.2, marginBottom: 30 }}>
              {inviteText}
            </div>
            
            {/* Date and time if available */}
            {(meeting.date || meeting.time) && (
              <div style={{ fontSize: 28, marginTop: 10 }}>
                {meeting.date && new Date(meeting.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
                {meeting.time && ` at ${meeting.time}`}
              </div>
            )}
          </div>
          
          {/* Logo/Watermark */}
          <div
            style={{
              position: 'absolute',
              bottom: 30,
              fontSize: 24,
              opacity: 0.8,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Codavra
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
  } catch (error) {
    console.error('Error generating OG image:', error);
    
    // Return fallback image on error
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
              fontSize: 60, 
              fontWeight: 'bold',
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '20px 40px',
              borderRadius: '12px',
            }}
          >
            Meeting Invitation
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
} 