import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// To avoid redirect loops, track recently redirected paths
const redirectCache = new Set<string>();
const CACHE_TIMEOUT = 5000; // 5 seconds

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log('Middleware executing for path:', path);
  
  // Prevent redirect loops
  const cacheKey = `${path}-${Date.now()}`;
  if (redirectCache.has(path)) {
    console.log('Skipping redirect for recently redirected path:', path);
    return NextResponse.next();
  }
  
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  console.log('Token state:', { 
    hasToken: !!token,
    email: token?.email,
    path: request.nextUrl.pathname,
    adminEmail: process.env.ADMIN_EMAIL
  });
  
  // Special handling for sign-in page
  if (path === '/auth/signin') {
    if (token) {
      // Already signed in, let the page handle it
      console.log('User already signed in and on signin page');
      return NextResponse.next();
    }
  }
  
  // Check if user is authenticated
  if (!token) {
    console.log('No token found, redirecting to sign in');
    const signInUrl = new URL('/auth/signin', request.url);
    
    // Only add callback for non-signin pages
    if (path !== '/auth/signin') {
      signInUrl.searchParams.set('callbackUrl', '/meeting/create');
    }
    
    console.log('Redirecting to:', signInUrl.toString());
    
    // Mark this path as recently redirected
    redirectCache.add(path);
    setTimeout(() => redirectCache.delete(path), CACHE_TIMEOUT);
    
    return NextResponse.redirect(signInUrl);
  }

  // For admin routes, check if user is admin
  if (request.nextUrl.pathname.startsWith('/admin/')) {
    console.log('Admin route check:', {
      userEmail: token.email,
      adminEmail: process.env.ADMIN_EMAIL,
      isAdmin: token.email === process.env.ADMIN_EMAIL
    });
    
    if (token.email !== process.env.ADMIN_EMAIL) {
      console.log('Non-admin accessing admin route, redirecting to /meeting/create');
      
      // Mark this path as recently redirected
      redirectCache.add(path);
      setTimeout(() => redirectCache.delete(path), CACHE_TIMEOUT);
      
      return NextResponse.redirect(new URL('/meeting/create', request.url));
    }
  }

  console.log('Middleware check passed, proceeding with request');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/meeting/create',
    '/admin/:path*',
    '/auth/signin',
  ],
}; 