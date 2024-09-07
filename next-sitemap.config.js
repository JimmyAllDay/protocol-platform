/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.BASE_URL || 'https://www.protocol-underground.com',
  generateRobotsTxt: true, // Generates a robots.txt file
  sitemapSize: 7000, // Max number of URLs per sitemap file
};
