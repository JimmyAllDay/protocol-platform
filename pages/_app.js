import '../styles/globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { AuthProvider } from 'context/AuthContext';
import { ToastProvider } from 'context/ToastContext';

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <AuthProvider>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </AuthProvider>
    </UserProvider>
  );
}
