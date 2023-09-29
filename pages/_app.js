import '../styles/globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { AuthProvider } from 'context/AuthContext';

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </UserProvider>
  );
}
