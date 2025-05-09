import { Metadata } from 'next';
import GradientBackgroundClient from '@/components/GradientBackgroundClient';

export const metadata: Metadata = {
  title: 'Meetings | Codavra',
  description: 'Browse and join meetings on Codavra.',
  openGraph: {
    title: 'Meetings | Codavra',
    description: 'Browse and join meetings on Codavra.',
    type: 'website',
    url: 'https://www.codavra.com/meeting',
    siteName: 'Codavra',
    images: [
      {
        url: 'https://grjqztijskvmeqrrqfwt.supabase.co/functions/v1/og-image?title=Codavra%20Meetings&organizer=Codavra&description=Browse%20and%20join%20meetings%20on%20Codavra',
        width: 1200,
        height: 630,
        alt: 'Codavra Meetings'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meetings | Codavra',
    description: 'Browse and join meetings on Codavra.',
    images: [
      'https://grjqztijskvmeqrrqfwt.supabase.co/functions/v1/og-image?title=Codavra%20Meetings&organizer=Codavra&description=Browse%20and%20join%20meetings%20on%20Codavra'
    ],
  }
};

export default function MeetingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Persistent gradient background that doesn't reload between navigations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <GradientBackgroundClient />
      </div>
      
      {/* Content with a nice fade-in effect */}
      <div className="transition-opacity duration-300">
        {children}
      </div>
    </div>
  );
} 