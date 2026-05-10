import createMiddleware from 'next-intl/middleware';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const adminAuthMiddleware = withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const isApiAdmin = req.nextUrl.pathname.startsWith('/api/admin');
    const isAdminPage =
      req.nextUrl.pathname.startsWith('/admin') &&
      !req.nextUrl.pathname.startsWith('/admin/login');

    if ((isAdminPage || isApiAdmin) && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
          return !!token;
        }
        if (path.startsWith('/api/admin')) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Apply next-auth middleware for admin and api/admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    return (adminAuthMiddleware as any)(req, {} as any);
  }

  // Apply next-intl middleware for all other routes
  return intlMiddleware(req);
}

export const config = {
  // Match both internationalized routes and admin routes
  matcher: [
    '/',
    '/(tr|en|ru|de|it|ar|pl)/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
