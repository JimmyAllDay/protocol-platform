import '../styles/globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { AuthProvider } from 'context/AuthContext';
import { StoreProvider } from 'context/Store';

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <AuthProvider>
        <StoreProvider>
          <Component {...pageProps} />
        </StoreProvider>
      </AuthProvider>
    </UserProvider>
  );
}
