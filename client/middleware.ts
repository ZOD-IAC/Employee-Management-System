import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;
  const isAuthenticated = Boolean(accessToken || refreshToken);
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
