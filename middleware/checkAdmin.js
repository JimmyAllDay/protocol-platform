import { NextResponse } from 'next/server';

export async function middleware(req) {
  console.log('checkAdmin middleware called for route: ', req.url);

  const token = req.headers.get('authorization');

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  const res = await fetch(new URL('/api/auth/checkAdmin', req.url), {
    headers: {
      Authorization: token,
    },
  });

  if (res.status === 200) {
    console.log('credentials confirmed');
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL('/forbidden', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/user/:path*'],
};
