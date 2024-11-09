import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import UserProfileLink from './UserProfileLink';
import AuthButtons from './AuthButtons';
import AdminLink from './AdminLink';
import Cart from './Cart';
import ThemeToggle from 'components/themetoggle/ThemeToggle';
import { useTheme } from 'context/ThemeContext';
import Logo from 'components/logo/Logo';

import { Spin as Hamburger } from 'hamburger-react';

const Header = ({ showNav, setShowNav, showNavMenu, links }) => {
  const { theme } = useTheme();

  return (
    <header className="bg-primary dark:bg-primaryDark text-primary dark:text-primaryDark p-6 w-screen">
      <div className="flex max-w-7xl mx-auto">
        <Logo stacked={true} width={120} />
        <nav className="ms-auto h-full hidden md:flex max-w-xl my-auto">
          <ul className="flex my-auto">
            {links.map((link, i) => {
              return (
                <Link key={i} href={link.href} className="link mx-2">
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
          className={`ms-auto md:hidden border-2 rounded dark:border-white border-black z-50 w-13 w-[52px] ${
            showNav ? 'text-primaryDark border-white fixed' : 'absolute'
          } top-10 right-4`}
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
