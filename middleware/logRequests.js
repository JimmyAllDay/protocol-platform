// middleware/logRequests.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  console.log('Log Requests middleware received for route:', req.url);

  // Log request headers
  const headers = req.headers;
  console.log('Request headers:', headers);

  // Log cookies
  const cookies = req.headers.get('cookie');
  console.log('Cookies:', cookies);

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', '/profile/:path*'],
};
