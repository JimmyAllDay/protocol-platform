import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from 'public/assets/images/PULogo - black.png';
import logoDark from 'public/assets/images/PULogo - white.png';
import UserProfileLink from './UserProfileLink';
import AuthButtons from './AuthButtons';
import AdminLink from './AdminLink';
import Cart from './Cart';
import ThemeToggle from 'components/themetoggle/ThemeToggle';
import { useTheme } from 'context/ThemeContext';

import { Spin as Hamburger } from 'hamburger-react';

const Header = ({ showNav, setShowNav, showNavMenu, links }) => {
  const { theme } = useTheme();

  return (
    <header className="bg-primary dark:bg-primaryDark text-primary dark:text-primaryDark p-6 w-screen">
      <div className="flex max-w-7xl mx-auto">
        <Link href="/">
          {theme === 'light' ? (
            <Image src={logo} alt="Logo" width={150} height={'auto'} priority />
          ) : (
            <Image
              src={logoDark}
              alt="Logo"
              width={150}
              height={'auto'}
              priority
            />
          )}
        </Link>

        <nav className="ms-auto h-full hidden md:flex max-w-xl my-auto">
          <ul className="flex my-auto">
            {links.map((link, i) => {
              return (
                <Link
                  key={i}
                  href={link.href}
                  className="hover:text-white dark:hover:text-accentDark mx-2"
                >
                  {link.name}
                </Link>
              );
            })}
          </ul>
          <UserProfileLink />
          <div className="hidden md:flex col-span-1">
            <AuthButtons />
          </div>
        </nav>
        <div
          className={`ms-auto md:hidden border-2 rounded dark:border-white z-50 w-13 w-[52px] ${
            showNav ? 'text-primaryDark border-white' : 'border-black'
          }`}
        >
          <Hamburger
            toggled={showNav}
            toggle={setShowNav}
            onToggle={(toggled) => showNavMenu()}
            size={29}
          />
        </div>
      </div>

      <div className="hidden md:flex max-w-7xl mx-auto pt-2">
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
