import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/',
    '/api/auth/send-otp',
    '/api/auth/verify-otp',
    '/api/auth/resend-otp',
    '/api/auth/verify-2fa',
];

// API routes that should be protected
const protectedApiRoutes = [
    '/api/chats',
    '/api/messages',
    '/api/groups',
    '/api/users',
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for public routes and static files
    if (
        publicRoutes.some(route => pathname.startsWith(route)) ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Check for authentication token
    const authCookie = request.cookies.get('chatfresh-auth');
    const authHeader = request.headers.get('authorization');

    // Extract token from cookie or header
    const token = authCookie?.value || authHeader?.replace('Bearer ', '');

    // For protected routes, verify authentication
    if (pathname.startsWith('/chat') || protectedApiRoutes.some(route => pathname.startsWith(route))) {
        if (!token) {
            console.log(`🔒 Unauthenticated access attempt to: ${pathname}`);

            // Redirect to login for web pages
            if (!pathname.startsWith('/api')) {
                const loginUrl = new URL('/auth/login', request.url);
                loginUrl.searchParams.set('redirect', pathname);
                return NextResponse.redirect(loginUrl);
            }

            // Return 401 for API routes
            return NextResponse.json(
                { success: false, message: 'Authentication required' },
                { status: 401 }
            );
        }

        // TODO: Verify JWT token here when implementing full session management
        // For now, just check if token exists

        console.log(`✅ Authenticated access to: ${pathname}`);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
