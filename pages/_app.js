import React from 'react';
import '../styles/globals.css';

import { AuthProvider } from 'context/AuthContext';
import { LoadingProvider } from 'context/LoadingContext';
import { ThemeProvider } from 'context/ThemeContext';
import { FacebookSDKProvider } from 'context/FacebookSDKContext';
import { HCaptchaProvider } from 'context/HCaptchaContext';

export default function MyApp({ Component, pageProps }) {
  return (
    <LoadingProvider>
      <AuthProvider>
        <ThemeProvider>
          <FacebookSDKProvider>
            <HCaptchaProvider>
              <Component {...pageProps} />
            </HCaptchaProvider>
          </FacebookSDKProvider>
        </ThemeProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}
