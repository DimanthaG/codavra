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

    // Use the absolute URL with the baseUrl to avoid path issues
    const ogImageUrl = `${baseUrl}/meeting/${params.id}/opengraph-image?t=${timestamp}`;

    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        type: 'website',
        url: `${baseUrl}/meeting/${params.id}`,
        siteName: 'Codavra',
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
        title: title,
        description: description,
        images: [ogImageUrl],
      },
      alternates: {
        canonical: `${baseUrl}/meeting/${params.id}`
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