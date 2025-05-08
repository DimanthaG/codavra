import { Metadata, ResolvingMetadata } from 'next';
import { supabase } from '@/utils/supabase';

interface Props {
  params: { id: string };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch meeting data
  const { data: meeting } = await supabase
    .from('meetings')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!meeting) {
    return {
      title: 'Meeting Invitation',
      description: 'Join this meeting',
    };
  }

  // Get base URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.codavra.com';
    
  const organizerName = meeting.created_by_name || 'Someone';
  const title = `${organizerName} has invited you to join ${meeting.title}`;
  
  // Format the date for a nice description
  const meetingDate = new Date(meeting.date || '').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const description = meeting.description || 
    `Join ${organizerName}'s meeting on ${meetingDate} at ${meeting.time}`;

  // Add a timestamp to break caching
  const timestamp = Date.now();
  const ogImageUrl = `${baseUrl}/meeting/${params.id}/opengraph-image?t=${timestamp}`;

  return {
    title: `${meeting.title} - Meeting Invitation`,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/meeting/${params.id}`,
      siteName: 'Codavra Meeting Manager',
      images: [
        {
          url: ogImageUrl, 
          width: 1200,
          height: 630,
          alt: 'Meeting Invitation'
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    other: {
      'og:image:secure_url': ogImageUrl,
    },
    alternates: {
      canonical: `${baseUrl}/meeting/${params.id}`,
    },
  };
} 