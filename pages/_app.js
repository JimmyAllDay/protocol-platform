import React from 'react';
import '../styles/globals.css';

import ErrorBoundary from 'components/errorHandling/ErrorBoundary';
import { AuthProvider } from 'context/AuthContext';
import { LoadingProvider } from 'context/LoadingContext';
import { ThemeProvider } from 'context/ThemeContext';
import { FacebookSDKProvider } from 'context/FacebookSDKContext';
import { HCaptchaProvider } from 'context/HCaptchaContext';

export default function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
