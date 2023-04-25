/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = {
  // Enable CSS modules
  cssModules: true,

  // Configure PostCSS
  postcssLoaderOptions: {
    postcssOptions: {
      plugins: ['postcss-import', 'tailwindcss', 'autoprefixer'],
    },
  },
  env: {
    AUTH0_SECRET:
      'g5ed5835b71eaf75ca29cefd261c42af94e15ef78d4ccf77dd780797ef1bd596',
    AUTH0_BASE_URL: 'http://localhost:3000/',
    AUTH0_ISSUER_BASE_URL: 'https://dev-nhhxoydcz60r77uh.us.auth0.com',
    AUTH0_CLIENT_ID: 'GrS8WnxCU0OdLxIIC2cC4EQZAm2Kfoax',
    AUTH0_CLIENT_SECRET:
      'yATJVg4Pj4Nn0_jHnGcgxmoPBlbZWER2ZfttX16aldzx-guw3fz9q4BWFzwaX2Ai',
  },
};
