import { ImageResponse } from 'next/og';
import { supabase } from '@/utils/supabase';

// Route segment config
export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Image generation
export default async function Image({ params }: { params: { id: string } }) {
  // Get meeting data
  let meeting = null;
  try {
    const { data } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', params.id)
      .single();
    
    meeting = data;
  } catch (error) {
    console.error('Error fetching meeting for OG image:', error);
  }

  // Default values if meeting data isn't available
  const title = meeting?.title || 'Meeting Invitation';
  const organizerName = meeting?.created_by_name || 'Someone';
  const description = meeting?.description || 'Join this meeting';

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
          <div style={{ fontSize: 48, fontWeight: 'bold', lineHeight: 1.2, marginBottom: 20 }}>
            {title}
          </div>
          
          <div style={{ fontSize: 36, marginTop: 10, marginBottom: 20, color: 'rgba(255,255,255,0.9)' }}>
            {organizerName} invites you to this meeting
          </div>

          <div style={{ fontSize: 24, marginTop: 10, color: 'rgba(255,255,255,0.8)' }}>
            {description}
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