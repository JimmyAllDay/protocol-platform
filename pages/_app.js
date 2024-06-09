import React from 'react';
import '../styles/globals.css';

import Script from 'next/script';

import { AuthProvider } from 'context/AuthContext';
import { LoadingProvider } from 'context/LoadingContext';
import { StoreProvider } from 'context/Store';

export default function MyApp({ Component, pageProps }) {
  return (
    <LoadingProvider>
      <AuthProvider>
        <StoreProvider>
          <Component {...pageProps} />
          <Script
            id="hotjar-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
          (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJARID},hjsv:${process.env.NEXT_PUBLIC_HOTJARSV}};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `,
            }}
          />
        </StoreProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}
