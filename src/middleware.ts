import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith('/auth');
  const isApiRoute = pathname.startsWith('/api');
  const isStaticFile = pathname.includes('.') || pathname.startsWith('/_next');
  const isRootPage = pathname === '/';
  
  // Publicly accessible product marketing & legal pages
  const isPublicPage = 
    pathname === '/privacy' || 
    pathname === '/terms' || 
    pathname === '/skeletonizer' || 
    pathname === '/consent' || 
    pathname === '/security-questionnaire' || 
    pathname === '/knowledge';

  const isSandboxCallback = pathname.startsWith('/api/billing/sandbox-callback');

  // Do not restrict static files, Next.js assets, auth APIs, public product/legal pages
  if (isStaticFile || isPublicPage || (isApiRoute && (pathname.includes('/auth') || isSandboxCallback))) {
    return NextResponse.next();
  }

  const isPreview = req.nextUrl.searchParams.get('preview') === 'true';

  // Redirect authenticated users trying to access login/register/landing page to /dashboard (unless previewing)
  if (token && (isAuthPage || (isRootPage && !isPreview))) {
    const dashboardUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Redirect unauthenticated users trying to access protected internal paths (e.g. /projects, /dashboard) to /auth
  if (!token && !isAuthPage && !isRootPage && !isPublicPage) {
    const loginUrl = new URL('/auth', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
