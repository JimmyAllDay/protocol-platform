import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LoginButtons from 'components/header/AuthButtons';
import NavProfileName from 'components/responsiveLayout/navProfileName/NavProfileName';
import ThemeToggle from 'components/themetoggle/ThemeToggle';

import logoDark from 'public/assets/images/PULogo - white.png';

import Image from 'next/image';

export default function NavMenu({ closeNav, navLinks, showNav }) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (showNav) {
      setShouldAnimate(true);
    }
  }, [showNav]);

  const mappedLinks = navLinks.map((link, i) => {
    return (
      <div>
        <Link
          href={link.href}
          className="navLink"
          onClick={() => {
            closeNav();
          }}
        >
          {link.name}
        </Link>
      </div>
    );
  });

  return (
    <div
      className={`fixed top-0 z-20 right-0 pt-32 w-full h-full bg-accent2 dark:bg-backgroundDark text-white transform border-2 border-black dark:border-accentDark flex flex-col ${
        shouldAnimate
          ? showNav
            ? 'translate-x-0'
            : 'translate-x-full'
          : 'translate-x-full'
      } transition-transform duration-300 ease-in-out`}
    >
      <Image
        src={logoDark}
        alt="Logo"
        width={150}
        height={'auto'}
        priority
        className="absolute top-10 left-4"
      />
      <div className="text-right flex flex-col mx-4 space-y-6 pt-6">
        <div className="ms-auto">
          <NavProfileName />
        </div>
        {mappedLinks}
        <div className="ms-auto">
          <LoginButtons />
        </div>
      </div>
      <div className="ms-auto mt-24 me-6">
        <ThemeToggle />
      </div>
    </div>
  );
}
