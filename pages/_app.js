import '../styles/globals.css';
import { useState } from 'react';
import Banner from 'components/Banner';

import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function MyApp({ Component, pageProps }) {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <UserProvider>
      {showBanner && <Banner />}
      <Component {...pageProps} />
    </UserProvider>
  );
}
