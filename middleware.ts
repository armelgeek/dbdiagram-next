import { NextResponse, type NextRequest } from 'next/server';

import { betterFetch } from '@better-fetch/fetch';

import type { auth } from '@/auth';

type Session = typeof auth.$Infer.Session;

const UNPROTECTED_ROUTES = ['/login', '/register'];
const PROTECTED_ROUTES = ['/d'];

export default async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { data: session } = await betterFetch<Session>('/api/auth/get-session', {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get('cookie') || '',
    },
  });

  // Handle protected routes (dashboard)
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Handle unprotected routes (auth-related)
  if (session && UNPROTECTED_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL('/d', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
