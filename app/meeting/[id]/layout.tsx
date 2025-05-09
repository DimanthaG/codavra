import type { Metadata } from 'next';
import { supabase } from '@/utils/supabase';
import Script from 'next/script';

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
    // Add timestamp and a random value to prevent caching
    const random = Math.floor(Math.random() * 1000);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const ogImageUrl = `${supabaseUrl}/functions/v1/og-image?title=${encodedTitle}&organizer=${encodedOrganizer}&description=${encodedDescription}&id=${params.id}&t=${timestamp}&r=${random}`;
    
    // Create an absolute URL with full HTTPS protocol
    const absoluteOgImageUrl = ogImageUrl.startsWith('http') ? ogImageUrl : `https:${ogImageUrl}`;
    
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
            url: absoluteOgImageUrl,
            // Use 1.91:1 ratio which WhatsApp often prefers
            width: 1200,
            height: 628,
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
        images: [absoluteOgImageUrl],
        site: '@codavra',
      },
      alternates: {
        canonical: meetingUrl
      },
      other: {
        // WhatsApp specific meta tags
        'og:image:width': '1200',
        'og:image:height': '628',
        'og:image:alt': 'Meeting Invitation',
        'og:image': absoluteOgImageUrl,
        'og:image:secure_url': absoluteOgImageUrl,
        'og:image:type': 'image/png',
        'theme-color': '#f97316', // Orange color for branded theme
        // Force large image preview format
        'twitter:card': 'summary_large_image',
        'twitter:image': absoluteOgImageUrl,
        'format-detection': 'telephone=no',
        // Facebook/WhatsApp recommended tags
        'og:updated_time': new Date().toISOString(),
        'og:title': title,
        'og:description': description,
        'og:url': meetingUrl,
        'og:site_name': 'Codavra',
        'og:type': 'website',
        // WhatsApp-specific properties
        'al:ios:url': meetingUrl,
        'al:android:url': meetingUrl,
        'al:web:url': meetingUrl,
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Meeting Invitation',
      description: 'Join this meeting',
    };
  }
}

export default function MeetingLayout({ children, params }: Props) {
  return (
    <>
      {/* JSON-LD structured data for better WhatsApp and search engine compatibility */}
      <Script id="meeting-jsonld" type="application/ld+json" 
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "Meeting Invitation",
            "description": "Join this online meeting",
            "startDate": new Date().toISOString(),
            "endDate": new Date(Date.now() + 3600000).toISOString(),
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
            "location": {
              "@type": "VirtualLocation",
              "url": `https://www.codavra.com/meeting/${params.id}`
            },
            "organizer": {
              "@type": "Organization",
              "name": "Codavra",
              "url": "https://www.codavra.com"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://www.codavra.com/meeting/${params.id}`,
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "image": {
              "@type": "ImageObject",
              "url": `https://www.codavra.com/api/og/${params.id}?t=${Date.now()}`,
              "width": "1200",
              "height": "628"
            }
          })
        }}
      />
      {/* Add a hidden meta tag with Supabase URL for client-side reference */}
      <meta name="supabase-url" content={process.env.NEXT_PUBLIC_SUPABASE_URL || ''} />
      {children}
    </>
  );
} 