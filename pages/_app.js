import React, { useEffect } from 'react';
import { hotjar } from 'react-hotjar';
import '../styles/globals.css';

import { AuthProvider } from 'context/AuthContext';
import { LoadingProvider } from 'context/LoadingContext';
import { StoreProvider } from 'context/Store';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      hotjar.initialize(process.env.HOTJARID, process.env.HOTJARSV);
    }
  }, []);

  return (
    <LoadingProvider>
      <AuthProvider>
        <StoreProvider>
          <Component {...pageProps} />
        </StoreProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}
