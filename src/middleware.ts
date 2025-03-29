import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('user');
  const isAuthenticated = !!userCookie;
  const path = request.nextUrl.pathname;

  // If user is not authenticated and trying to access dashboard
  if (!isAuthenticated && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // If user is authenticated and trying to access signin page
  if (isAuthenticated && (path === '/signin' || path === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/']
}; 