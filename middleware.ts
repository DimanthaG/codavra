import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  
  // Check if user is authenticated
  if (!token) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // For admin routes, check if user is admin
  if (request.nextUrl.pathname.startsWith('/admin/')) {
    if (token.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.redirect(new URL('/meeting/create', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/meeting/create',
    '/admin/:path*',
  ],
}; 