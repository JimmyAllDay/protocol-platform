import Image from 'next/image';
import Link from 'next/link';
import logo from 'public/assets/images/PULogo - white.png';
import UserProfileLink from './UserProfileLink';
import AuthButtons from './AuthButtons';
import AdminLink from './AdminLink';

function HeaderLinks({ links }) {
  return (
    <nav className="h-full flex">
      <ul className="flex my-auto">
        {Object.entries(links).map(([key, value]) => (
          <li key={key} className="hover:text-accent ms-4">
            <Link href={value}>{key}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const Header = () => {
  const links = {
    About: '/about',
    Contact: '/contact',
    Events: '/events',
  };

  return (
    <header className="bg-primary w-screen text-primary">
      <nav className="flex p-4 max-w-screen-xl mx-auto">
        <div>
          <Link href="/">
            <Image src={logo} alt="Logo" width={150} height={'auto'} priority />
          </Link>
        </div>
        <div className="ms-auto">
          <HeaderLinks links={links} />
        </div>
        <UserProfileLink />
        <AuthButtons />
      </nav>
    </header>
  );
};

export default Header;
