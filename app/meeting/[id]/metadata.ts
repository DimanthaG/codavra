import { Metadata, ResolvingMetadata } from 'next';
import { supabase } from '@/utils/supabase';

type Props = {
  params: { id: string };
};

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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
    (typeof window !== 'undefined' ? window.location.origin : '');
    
  const organizerName = meeting.created_by_name || 'Someone';
  const title = `${organizerName} Has Invited You!`;
  const description = meeting.description || `Join ${organizerName}'s meeting: ${meeting.title}`;

  return {
    title: `${meeting.title} - Meeting Invitation`,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      // The OG image will be automatically picked up from the opengraph-image.tsx file
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      // The Twitter image will be automatically picked up from the opengraph-image.tsx file
    },
  };
} 