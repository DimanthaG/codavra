'use client';

import { useEffect, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const GradientBackground = dynamic(() => import('@/components/GradientBackground'), { ssr: false });

function SignInContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/meeting/create';
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Debug logging
    console.log('Session state:', { session, status, callbackUrl, hasRedirectedYet: hasRedirected.current });
    
    // Prevent redirect loops
    if (status === 'loading' || hasRedirected.current) return;
    
    if (session) {
      try {
        // Prevent multiple redirects
        if (hasRedirected.current) return;
        hasRedirected.current = true;
        
        console.log('Auth state:', { 
          userEmail: session.user?.email, 
          adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
          pathname: window.location.pathname
        });
        
        // If we're already at the desired location, don't redirect
        if (window.location.pathname !== '/auth/signin') {
          console.log('Already at target location, skipping redirect');
          return;
        }
        
        // Simple redirect to fixed location to break the loop
        console.log('Redirecting to /meeting/create');
        window.location.replace('/meeting/create');
      } catch (error) {
        console.error('Error during redirect:', error);
      }
    }
  }, [session, status, router, callbackUrl]);

  const handleSignIn = () => {
    console.log('Starting sign in with callback URL:', callbackUrl);
    signIn('google', { 
      callbackUrl: '/meeting/create', // Force a specific callback URL
      redirect: true,
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Don't show the sign-in UI if already authenticated
  if (status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">You are signed in. Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <GradientBackground />
      </div>
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Sign In</h1>
        <div className="space-y-4">
          <button
            onClick={handleSignIn}
            className="w-full bg-white text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.283,10.356h-8.327v3.451h4.792c-0.446,2.193-2.313,3.453-4.792,3.453c-2.923,0-5.279-2.356-5.279-5.28 c0-2.923,2.356-5.279,5.279-5.279c1.259,0,2.397,0.447,3.29,1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233 c-4.954,0-8.934,3.979-8.934,8.934c0,4.955,3.979,8.934,8.934,8.934c4.467,0,8.529-3.249,8.529-8.934 C20.485,11.453,20.404,10.884,20.283,10.356z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
} 