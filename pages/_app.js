import React, { useEffect } from 'react';
import '../styles/globals.css';

import ErrorBoundary from 'components/errorHandling/ErrorBoundary';
import { AuthProvider } from 'context/AuthContext';
import { LoadingProvider } from 'context/LoadingContext';
import { ThemeProvider } from 'context/ThemeContext';
import { FacebookSDKProvider } from 'context/FacebookSDKContext';
import { HCaptchaProvider } from 'context/HCaptchaContext';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const userTheme = localStorage.getItem('user-theme-preference');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    const initialTheme = userTheme || systemTheme;
    document.documentElement.classList.add(initialTheme);
  }, []);

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
