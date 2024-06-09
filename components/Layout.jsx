import React, { useState, useContext, useEffect } from 'react';

import Head from 'next/head';
import GoogleAnalytics from './analytics/GoogleAnalytics';
import HotJar from './analytics/HotJar';

import Header from './header/Header';
import Footer from './footer/Footer';
import Banner from 'components/header/Banner';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { LoadingContext } from 'context/LoadingContext';

const Layout = ({ title, children }) => {
  const [showBanner, setShowBanner] = useState(true);
  const { loading } = useContext(LoadingContext);

  return (
    <>
      <Head>
        <title>{title ? title + ' - Pro.ground' : 'Pro.ground'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GoogleAnalytics />
      <HotJar />
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
      <Header />
      <main className="font-mono min-h-screen bg-background flex flex-col">
        {loading ? <div className="text-primary">Loading...</div> : children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
