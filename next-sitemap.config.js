/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.BASE_URL || 'https://www.protocol-underground.com',
  generateRobotsTxt: true, // Generates a robots.txt file
  exclude: [
    '/auth/*', // All authentication pages (e.g. login, register)
    '/dashboard/*', // All dashboard pages (admin and user dashboards)
    '/user/*', // User-specific pages (profile, uploads)
    '/admin/*', // Admin-only routes (if you have any) // Exclude contact page if you don't want it
    // Add any other routes you want to exclude here
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/auth' },
      { userAgent: '*', disallow: '/dashboard' },
      { userAgent: '*', disallow: '/user' },
      { userAgent: '*', disallow: '/admin' },
    ],
  },
};
