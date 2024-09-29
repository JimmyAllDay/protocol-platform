import React, { useState, useContext, useEffect } from 'react';

import Head from 'next/head';
import GoogleAnalytics from './analytics/GoogleAnalytics';
import HotJarAnalytics from './analytics/HotJarAnalytics';

import Header from './header/Header';
import Footer from './footer/Footer';
import Banner from 'components/header/Banner';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { LoadingContext } from 'context/LoadingContext';

import { CSSTransition } from 'react-transition-group';
import NavMenu from 'components/responsiveLayout/navMenu/NavMenu';

import { AuthContext } from 'context/AuthContext';

import headerLinks, { footerLinks, getNavMenuLinks } from 'utils/links';

const Layout = ({ title, children, ...rest }) => {
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

  return (
    <>
      <Head>
        <title>{title ? title + ' - Pro.ground' : 'Pro.ground'}</title>
        <meta name="description" content="Protocol Underground" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="keywords"
          content="music, EDM, dance, djs, party, electronic, dance, music"
        />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://www.protocol-underground.com" />
      </Head>
      <GoogleAnalytics />
      <HotJarAnalytics />
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
        links={headerLinks}
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
              navLinks={getNavMenuLinks(user)}
              showNavMenu={showNavMenu}
            />
          </div>
        </CSSTransition>
      }
      <main className="font-mono min-h-screen bg-primary dark:bg-primaryDark text-primary dark:text-primaryDark flex flex-col w-screen">
        {loading ? <div>Loading...</div> : children}
      </main>
      <Footer links={footerLinks} />
    </>
  );
};

export default Layout;
