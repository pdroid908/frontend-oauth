import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // 1. Tentukan path yang BOLEH diakses tanpa login
  const publicPaths = ['/tampilan/login', '/tampilan/register', '/'];
  const isPublicPath = publicPaths.includes(pathname);

  // 2. Jika tidak ada token dan mencoba akses selain public path, redirect ke login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/tampilan/login', request.url));
  }

  // 3. Jika sudah ada token tapi mencoba akses halaman login/register, arahkan ke dashboard
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/konten-utama/dashboard', request.url));
  }

  return NextResponse.next();
}

// 4. Matcher menangkap SEMUA path
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};