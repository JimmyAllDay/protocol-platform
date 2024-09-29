import React from 'react';
import Link from 'next/link';
import SocialLinks from '../socialLinks/SocialLinks';
import AuthLinks from './AuthLinks';
import Image from 'next/image';
import logo from 'public/assets/images/PULogo - black.png';
import logoDark from 'public/assets/images/PULogo - white.png';

import { useTheme } from 'context/ThemeContext';

import MailListForm from './MailListForm';

function Footer({ links }) {
  const { theme } = useTheme();

  return (
    <footer className="grid grid-cols-6 w-screen bg-primary dark:bg-primaryDark text-primary dark:text-primaryDark pt-24">
      <div className="flex flex-col space-y-2 col-span-4 sm:col-span-2 order-2 lg:col-span-2 lg:order-1 m-4">
        <div className="ms-4">
          {theme === 'light' ? (
            <Link href="/">
              <Image src={logo} alt="Logo" width={200} height={'auto'} />
            </Link>
          ) : (
            <Link href="/">
              <Image src={logoDark} alt="Logo" width={200} height={'auto'} />
            </Link>
          )}
        </div>
        <div className="flex flex-col ps-4 ms-4">
          <ul className="grid grid-cols-2">
            {links.map((link, i) => {
              return (
                <li key={i} className="mb-2 inline-block">
                  <Link key={i} href={link.href} className="link inline-block">
                    {link.name}
                  </Link>
                </li>
              );
            })}
            <AuthLinks />
          </ul>
        </div>
      </div>

      <div className="flex col-span-6 sm:col-span-4 order-1 sm:order-2 lg:col-span-3 lg:order-1 mb-16 sm:mb-0">
        <div className="m-auto">
          <MailListForm />
        </div>
      </div>

      <div className="col-span-2 order-2 flex sm:col-span-6 sm:order-3 lg:col-span-1 lg:order-1 sm:mt-16 lg:mt-0 pe-2">
        <div className="ms-auto me-4 sm:mx-auto lg:ms-auto lg:me-6 mt-4">
          <SocialLinks />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center col-span-6 pt-12 order-4">
        <div className="text-sm text-center">
          This site is protected by hCaptcha and its{' '}
          <Link className="link" href="https://www.hcaptcha.com/privacy">
            Privacy Policy{' '}
          </Link>
          and{' '}
          <Link className="link" href="https://www.hcaptcha.com/terms">
            Terms of Service{' '}
          </Link>
          apply.
        </div>
        <div className="text-sm my-4 flex flex-col">
          &copy; 2024 Protocol Underground. All rights reserved.
          <span className="mx-auto">An All Day project.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
