import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all paths except admin, api, _next, and static files
  matcher: ['/((?!admin|api|_next|_vercel|.*\\..*).*)'],
};
