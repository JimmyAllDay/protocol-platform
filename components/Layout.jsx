import Head from 'next/head';
import Header from './Header';
import Footer from './footer/Footer';
import { useUser } from '@auth0/nextjs-auth0/client';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ title, children }) => {
  const { user, error, isLoading, userProfile } = useUser();

  return (
    <>
      <Head>
        <title>{title ? title + ' - Pro.ground' : 'Pro.ground'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Header />
      <main className="h-screen font-mono min-h-screen">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
