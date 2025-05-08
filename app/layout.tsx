import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';

// Import GradientBackground component outside of the RootLayout to prevent SSR
const GradientBackground = dynamic(() => import('@/components/GradientBackground'), { ssr: false });

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Codavra',
  description: 'We Craft Websites That Grow with You',
  metadataBase: new URL('https://www.codavra.com'),
  openGraph: {
    type: 'website',
    title: 'Codavra',
    description: 'We Craft Websites That Grow with You',
    siteName: 'Codavra',
    url: 'https://www.codavra.com',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Codavra'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Codavra',
    description: 'We Craft Websites That Grow with You',
    images: ['/opengraph-image']
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative min-h-screen`}>
        <Providers>
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <GradientBackground />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
