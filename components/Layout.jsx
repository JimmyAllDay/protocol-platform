import React, { useState, useContext, useEffect } from 'react';

import Head from 'next/head';
import GoogleAnalytics from './analytics/GoogleAnalytics';
import HotJarAnalytics from './analytics/HotJarAnalytics';
import FacebookSDK from './facebook/FacebookSDK';

import Header from './header/Header';
import Footer from './footer/Footer';
import Banner from 'components/header/Banner';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { LoadingContext } from 'context/LoadingContext';

import { CSSTransition } from 'react-transition-group';
import NavMenu from 'components/responsiveLayout/navMenu/NavMenu';

import { AuthContext } from 'context/AuthContext';

const Layout = ({ title, children }) => {
  const [showBanner, setShowBanner] = useState(true);
  const [showNav, setShowNav] = useState(false);
  const { loading } = useContext(LoadingContext);
  const { user } = useContext(AuthContext);

  const showNavMenu = () => {
    setShowNav(!showNav);
  };

  const closeNav = () => {
    setShowNav(false);
  };

  const links = [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Events', href: '/events' },
  ];

  const navMenuLinks = user
    ? [
        { name: 'Profile', href: '/user/profile' },
        { name: 'Uploads', href: '/user/uploads' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Events', href: '/events' },
      ]
    : [
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Events', href: '/events' },
      ];

  return (
    <>
      <Head>
        <title>{title ? title + ' - Pro.ground' : 'Pro.ground'}</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GoogleAnalytics />
      <HotJarAnalytics />
      <FacebookSDK />
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {showBanner && <Banner />}
      <Header
        showNav={showNav}
        setShowNav={setShowNav}
        showNavMenu={showNavMenu}
        links={links}
      />
      {
        <CSSTransition
          in={showNav}
          timeout={300}
          classNames="nav"
          unmountOnExit
        >
          <div className="dark:bg-dark">
            <NavMenu
              showNav={showNav}
              closeNav={closeNav}
              navLinks={navMenuLinks}
              showNavMenu={showNavMenu}
            />
          </div>
        </CSSTransition>
      }
      <main className="font-mono min-h-screen bg-primary dark:bg-primaryDark dark:text-primaryDark flex flex-col w-screen">
        {loading ? <div className="text-primary">Loading...</div> : children}
      </main>
      <Footer links={links} />
    </>
  );
};

export default Layout;
