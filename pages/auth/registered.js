//* Partially Protected Page
import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import Layout from '../../components/Layout';

import showToast from 'utils/toastUtils';

import { AuthContext } from 'context/AuthContext';

const Registered = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const { registered } = router.query;
    if (registered) {
      showToast('Email sent to inbox.');
    }
  }, [router.query]);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [router, user]);

  return (
    <Layout>
      <div className="my-auto text-3xl mx-auto space-y-4 text-center">
        <h1>Almost there.</h1>
        <h1>Please verify the email sent to your inbox, then sign in.</h1>
        <Link href="/auth/login">
          <button className="button-primary mt-8 p-1">Login</button>
        </Link>
      </div>
    </Layout>
  );
};

export default Registered;

export const getServerSideProps = async (context) => {
  const verifyToken = require('lib/firebase/server/ssr/verifyToken').default;
  const getSingleDoc = require('lib/firebase/server/ssr/getSingleDoc').default;
  const handleError = require('lib/firebase/server/ssr/handleError').default;

  try {
    const { req } = context;
    const { cookies } = req;
    const token = cookies.p_sessionId || '';

    // If a token exists, verify it and redirect the user if logged in
    if (token) {
      const decodedToken = await verifyToken(token);
      const uid = decodedToken.uid;

      try {
        const userData = await getSingleDoc('userProfiles', uid);

        // If the user data is valid, redirect to the main page
        if (userData) {
          return {
            redirect: {
              destination: '/',
              permanent: false,
            },
          };
        }
      } catch (error) {
        console.error('Invalid or revoked token');
        // Destroy the cookie if token or user data is invalid/revoked
        destroyCookie(context, 'p_sessionId', { path: '/' });
      }
    }

    // If the token doesn't exist or is invalid, let the user proceed to the login page
    return {
      props: {},
    };
  } catch (error) {
    return handleError(error);
  }
};
