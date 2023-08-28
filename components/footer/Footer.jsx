import Link from 'next/link';
import SocialLinks from './SocialLinks';
import AuthLinks from '../AuthLinks';
import Image from 'next/image';
import logo from 'public/assets/images/PULogo - white.png';

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
  };

  return (
    <footer className="grid grid-cols-2 gap-4 w-screen bg-primary text-primary">
      <div className="ps-8 mt-2 flex flex-col">
        <Link href="/" className="mb-4">
          <Image src={logo} alt="Logo" width={200} height={'auto'} />
        </Link>
        <div className="flex flex-col ps-4">
          <FooterLinks links={links} />
          <AuthLinks />
        </div>
      </div>
      <div className="me-4 mt-2 flex">
        <div className="ms-auto pr-6">
          <SocialLinks col={true} />
        </div>
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
