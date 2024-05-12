import Image from 'next/image';
import Link from 'next/link';
import logo from 'public/assets/images/PULogo - white.png';
import UserProfileLink from './UserProfileLink';
import AuthButtons from './AuthButtons';
import AdminLink from './AdminLink';
import Cart from './Cart';

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
    <header className="bg-primary w-screen text-primary flex flex-col pb-4">
      <div className="flex ps-4 pe-4 pt-4 pb-1 max-w-screen-xl mx-auto w-full">
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
        <div className="ms-3 pt-2">
          {/*Cart goes here when store is up and running*/}
        </div>
      </div>
    </header>
  );
};

export default Header;
