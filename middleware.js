import { middleware as logRequestsMiddleware } from './middleware/logRequests';
import { middleware as checkAdminMiddleware } from './middleware/checkAdmin';

export async function middleware(req) {
  // checkAdminMiddleware(req);
}

export const config = {
  matcher: ['/dashboard/:path*', '/user/:path*'],
};
