import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith('/auth');
  const isApiRoute = pathname.startsWith('/api');
  const isStaticFile = pathname.includes('.') || pathname.startsWith('/_next');
  const isRootPage = pathname === '/';
  const isSandboxCallback = pathname.startsWith('/api/billing/sandbox-callback');

  // Do not restrict static files, Next.js assets, auth APIs, or sandbox billing callback
  if (isStaticFile || (isApiRoute && (pathname.includes('/auth') || isSandboxCallback))) {
    return NextResponse.next();
  }

  const isPreview = req.nextUrl.searchParams.get('preview') === 'true';

  // Redirect authenticated users trying to access login/register/landing page to /dashboard (unless previewing)
  if (token && (isAuthPage || (isRootPage && !isPreview))) {
    const dashboardUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Redirect unauthenticated users trying to access protected paths to /auth
  if (!token && !isAuthPage && !isRootPage) {
    const loginUrl = new URL('/auth', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
