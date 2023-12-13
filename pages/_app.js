import '../styles/globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { AuthProvider } from 'context/AuthContext';
import { StoreProvider } from 'context/Store';
import { EdgeStoreProvider } from 'lib/edgestore';

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <AuthProvider>
        <StoreProvider>
          <EdgeStoreProvider>
            <Component {...pageProps} />
          </EdgeStoreProvider>
        </StoreProvider>
      </AuthProvider>
    </UserProvider>
  );
}
