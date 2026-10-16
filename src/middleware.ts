import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin') || '*';

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      const preflightHeaders = new Headers();
      preflightHeaders.set('Access-Control-Allow-Origin', origin);
      preflightHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      preflightHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
      if (origin !== '*') {
        preflightHeaders.set('Access-Control-Allow-Credentials', 'true');
      }
      preflightHeaders.set('Access-Control-Max-Age', '86400');
      return new NextResponse(null, { status: 204, headers: preflightHeaders });
    }

    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    if (origin !== '*') {
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
