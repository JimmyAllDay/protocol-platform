import React, { useState, useContext, useEffect } from 'react';

import Head from 'next/head';
import Script from 'next/script';

import Header from './header/Header';
import Footer from './footer/Footer';
import Banner from 'components/header/Banner';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { LoadingContext } from 'context/LoadingContext';

const Layout = ({ title, children }) => {
  const [showBanner, setShowBanner] = useState(true);
  const { loading } = useContext(LoadingContext);

  const hotjarId = 5016933;
  const hotjarSv = 6;
  const googleAnalyticsId = 'G-MCYH6WMHBX';

  return (
    <>
      <Script
        strategy="beforeInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
      />
      <Script
        id="google-analytics-script"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${googleAnalyticsId}');
          `,
        }}
      />
      <Script
        id="hotjar-script"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${hotjarId},hjsv:${hotjarSv}};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `,
        }}
      />
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
      <main className="font-mono min-h-screen bg-background flex flex-col">
        {loading ? <div className="text-primary">Loading...</div> : children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
