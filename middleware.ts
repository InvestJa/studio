import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AUTH_TOKEN_COOKIE_NAME = 'mockAuthToken'; // Same as in lib/auth.ts

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;

  const isAuthenticated = !!authToken;

  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.includes(pathname);

  if (isAuthRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Simplified conditional logic
  if (!isAuthenticated && (pathname.startsWith('/dashboard') || pathname.startsWith('/clients') || pathname.startsWith('/payments') || pathname.startsWith('/settings'))) {
    let from = pathname;
    if (request.nextUrl.search) {
      from += request.nextUrl.search;
    }
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, request.url));
  }
  
  if (pathname === '/') {
     if (isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
     }
     return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};