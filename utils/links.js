const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://protocol-underground.com';

const headerLinks = [
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Events', href: '/events' },
];

export const footerLinks = [
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Events', href: '/events' },
  { name: 'Terms', href: '/terms' },
  { name: 'Privacy', href: '/privacy' },
  { name: 'FAQ', href: '/faq' },
  {
    name: 'Site Map',
    href: `${baseUrl}/sitemap-0.xml`,
  },
];

// Export navMenuLinks dynamically based on the user
export const getNavMenuLinks = (user) => {
  return user
    ? [
        { name: 'Profile', href: '/user/profile' },
        { name: 'Uploads', href: '/user/uploads' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Events', href: '/events' },
      ]
    : [
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Events', href: '/events' },
      ];
};

export default headerLinks;
