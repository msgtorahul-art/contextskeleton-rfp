import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith('/auth');
  const isApiRoute = pathname.startsWith('/api');
  const isStaticFile = pathname.includes('.') || pathname.startsWith('/_next');
  const isRootPage = pathname === '/';
  
  // Publicly accessible pages (Landing, Free Skeletonizer Tool, Blog, Privacy, Terms, Trust)
  const isPublicPage = 
    pathname === '/privacy' || 
    pathname === '/terms' || 
    pathname === '/skeletonizer' || 
    pathname === '/trust' ||
    pathname.startsWith('/blog');

  const isSandboxCallback = pathname.startsWith('/api/billing/sandbox-callback');

  // Do not restrict static files, Next.js assets, auth APIs, public blog/legal/skeletonizer pages
  if (isStaticFile || isPublicPage || (isApiRoute && (pathname.includes('/auth') || isSandboxCallback))) {
    return NextResponse.next();
  }

  const isPreview = req.nextUrl.searchParams.get('preview') === 'true';

  // Basic check for presence of token cookie
  if (token) {
    // If user is on /auth or root landing page while token is present, redirect to /dashboard (unless previewing)
    if (isAuthPage || (isRootPage && !isPreview)) {
      const dashboardUrl = new URL('/dashboard', req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  } else {
    // If user has NO token cookie and tries to access protected routes, redirect cleanly to /auth
    if (!isAuthPage && !isRootPage && !isPublicPage) {
      const loginUrl = new URL('/auth', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
