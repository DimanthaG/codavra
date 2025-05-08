import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  console.log('Middleware executing for path:', request.nextUrl.pathname);
  
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
  
  // Check if user is authenticated
  if (!token) {
    console.log('No token found, redirecting to sign in');
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    console.log('Redirecting to:', signInUrl.toString());
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
  ],
}; 