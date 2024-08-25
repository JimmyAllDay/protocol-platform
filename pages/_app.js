import React from 'react';
import '../styles/globals.css';

import { AuthProvider } from 'context/AuthContext';
import { LoadingProvider } from 'context/LoadingContext';
import { ThemeProvider } from 'context/ThemeContext';

export default function MyApp({ Component, pageProps }) {
  return (
    <LoadingProvider>
      <AuthProvider>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}
