import type { Metadata } from 'next';
import { supabase } from '@/utils/supabase';

interface Props {
  children: React.ReactNode;
  params: { id: string };
}

export async function generateMetadata(
  { params }: Omit<Props, 'children'>
): Promise<Metadata> {
  try {
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

    const baseUrl = 'https://www.codavra.com';
    const organizerName = meeting.created_by_name || 'Someone';
    const timestamp = new Date().getTime();
    
    // Create consistent title format
    const title = `${organizerName} has invited you to ${meeting.title}`;
    const description = meeting.description || `Join ${organizerName}'s meeting`;

    // Pass meeting details as query parameters to the Supabase Edge Function
    const encodedTitle = encodeURIComponent(meeting.title);
    const encodedOrganizer = encodeURIComponent(organizerName);
    const encodedDescription = encodeURIComponent(description);
    
    // Use Supabase Edge Function for OG image generation
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const ogImageUrl = `${supabaseUrl}/functions/v1/og-image?title=${encodedTitle}&organizer=${encodedOrganizer}&description=${encodedDescription}&id=${params.id}&t=${timestamp}`;
    
    // The complete URL for this meeting
    const meetingUrl = `${baseUrl}/meeting/${params.id}`;

    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        type: 'website',
        url: meetingUrl,
        siteName: 'Codavra',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: 'Meeting Invitation',
            type: 'image/png',
          }
        ],
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [ogImageUrl],
        site: '@codavra',
      },
      alternates: {
        canonical: meetingUrl
      },
      other: {
        // WhatsApp specific meta tags
        'og:image:width': '1200',
        'og:image:height': '630',
        'og:image:alt': 'Meeting Invitation',
        'theme-color': '#f97316', // Orange color for branded theme
        // Force large image preview format
        'twitter:card': 'summary_large_image',
        'format-detection': 'telephone=no',
      }
    };
  } catch (error) {
    console.error('Error generating meeting metadata:', error);
    return {
      title: 'Meeting Invitation',
      description: 'Join this meeting',
    };
  }
}

export default function MeetingLayout({ children }: Props) {
  return children;
} 