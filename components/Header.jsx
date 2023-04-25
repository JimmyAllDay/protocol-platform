import Image from 'next/image';
import Link from 'next/link';
import logo from '../public/assets/images/PULogo - white.png';
import UserProfile from './UserProfile';
import LoginButtons from './LoginButtons';
import { useUser } from '@auth0/nextjs-auth0/client';

function HeaderLinks({ links }) {
  return (
    <nav className="h-full flex">
      <ul className="flex my-auto space-x-4 justify-around">
        {Object.entries(links).map(([key, value]) => (
          <li key={key} className="hover:text-accent">
            <Link href={value}>{key}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const Header = () => {
  const { user, error, isLoading } = useUser();
  const links = {
    About: '/about',
    Contact: '/contact',
  };

  return (
    <header className="max-w-screen-xl mx-auto">
      <nav className="flex p-4">
        <div>
          <Link href="/">
            <Image src={logo} alt="Logo" width={150} height={150} />
          </Link>
        </div>
        <div className="ms-auto">
          <HeaderLinks links={links} />
        </div>
        <div className="ms-6">
          <UserProfile />
        </div>
        <LoginButtons user={user} />
      </nav>
    </header>
  );
};

export default Header;
