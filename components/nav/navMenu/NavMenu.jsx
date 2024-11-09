import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LoginButtons from 'components/header/AuthButtons';
import NavProfileName from 'components/responsiveLayout/navProfileName/NavProfileName';
import ThemeToggle from 'components/themetoggle/ThemeToggle';
import Logo from 'components/logo/Logo';

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
      <div key={`NavMenu-mapped-link-${i}`}>
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
      <div className="absolute top-12 left-4">
        <Logo width={120} preferred={'darkStacked'} />
      </div>
      <div className="text-right flex flex-col mx-4 space-y-6 pt-6">
        <div className="ms-auto">
          <NavProfileName />
        </div>
        {mappedLinks}
        <div className="ms-auto">
          <LoginButtons />
        </div>
      </div>
      <div className="ms-auto mt-6 me-6">
        <ThemeToggle />
      </div>
    </div>
  );
}
