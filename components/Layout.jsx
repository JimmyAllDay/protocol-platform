import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from 'context/AuthContext';

import Head from 'next/head';
import Header from './header/Header';
import Footer from './footer/Footer';
import Banner from 'components/header/Banner';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ title, children }) => {
  const [showBanner, setShowBanner] = useState(true);
  const { user, error, loading, isLoading, redirect, userDetails } =
    useContext(AuthContext);

  return (
    <>
      <Head>
        <title>{title ? title + ' - Pro.ground' : 'Pro.ground'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
      <main className="font-mono min-h-screen bg-background flex flex-col py-24">
        {loading || isLoading ? <p>Please wait...</p> : children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
