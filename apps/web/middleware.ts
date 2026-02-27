import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Add Security Headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

    // Basic Rate Limiting Header Flags (Mock setup for DDoS protection)
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    response.headers.set('X-RateLimit-Limit', '100');
    
    return response;
}

export const config = {
    matcher: '/api/:path*',
};
