// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Renommer la fonction de middleware à proxy
export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname, search } = request.nextUrl;

  // Routes publiques
  const publicRoutes = ['/', '/explore', '/login', '/register'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  // Routes d'authentification
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  // Routes protégées
  const protectedRoutes = ['/offers/create', '/offers/edit', '/messages', '/profile'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Routes API protégées
  const isProtectedApi = pathname.startsWith('/api/') && 
                         !pathname.startsWith('/api/auth') &&
                         !pathname.startsWith('/api/test');

  // Route protégée sans token
  if ((isProtectedRoute || isProtectedApi) && !token) {
    if (!pathname.startsWith('/api')) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('callbackUrl', pathname + search);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.json(
      { error: 'Non authentifié' },
      { status: 401 }
    );
  }

  // Connecté essaie d'accéder à login/register
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)',
  ],
};