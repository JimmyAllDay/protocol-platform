import Link from 'next/link';
import SocialLinks from './SocialLinks';

function FooterLinks({ links }) {
  return (
    <nav>
      <ul className="flex flex-col">
        {Object.entries(links).map(([key, value]) => (
          <li key={key} className="mr-4 hover:text-accent max-w-0">
            <Link href={value}>{key}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Footer() {
  const links = {
    About: '/about',
    Contact: '/contact',
    Login: '/login',
    Register: '/register',
  };

  return (
    <footer className="grid grid-cols-2 gap-4 w-screen bg-primary text-primary">
      <div className="ps-8 mt-2">
        <FooterLinks links={links} />
      </div>
      <div className="me-4 mt-2">
        <SocialLinks />
      </div>
      <div className="flex items-center justify-center col-span-2">
        <p className="text-xs mt-4">
          &copy; 2023 Protocol Underground. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
