import Link from 'next/link';
import SocialLinks from './SocialLinks';
import AuthLinks from './AuthLinks';
import Image from 'next/image';
import logo from 'public/assets/images/PULogo - white.png';
import MailListForm from './MailListForm';

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
    <footer className="grid grid-cols-2 w-screen bg-primary text-primary pt-10">
      <div className="ps-8 flex flex-col space-y-2">
        <Link href="/">
          <Image src={logo} alt="Logo" width={200} height={'auto'} />
        </Link>
        <div className="flex flex-col ps-4">
          <FooterLinks links={links} />
          <AuthLinks />
        </div>
      </div>

      <div className="me-4 mt-2 flex">
        <div className="w-2/3 mt-auto">
          <MailListForm />
        </div>
        <div className="ms-auto pr-6">
          <SocialLinks col={true} />
        </div>
      </div>

      <div className="flex items-center justify-center col-span-2 pt-12">
        <p className="text-xs mt-4 flex flex-col">
          &copy; 2023 Protocol Underground. All rights reserved.
          <span className="mx-auto">An All Day project.</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
