import Layout from '../../components/Layout';
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import ProfileForm from 'components/forms/profileForm/ProfileForm';

import { AuthContext } from 'context/AuthContext.jsx';

import { destroyCookie } from 'nookies';

import showToast from 'utils/toastUtils';

export default function Profile({ user }) {
  const router = useRouter();
  const { profileComplete } = router.query;

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [router, user]);

  useEffect(() => {
    if (profileComplete === 'false') {
      showToast('Please complete your profile before uploading a mix.');
    }
  }, [profileComplete]);

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center font-mono space-y-4 p-2">
        <h1 className="text-3xl">Profile</h1>
        <ProfileForm user={user} />
      </main>
    </Layout>
  );
}

export const getServerSideProps = async (context) => {
  const verifyToken = require('lib/firebase/server/ssr/verifyToken').default;
  const getSingleDoc = require('lib/firebase/server/ssr/getSingleDoc').default;
  const handleError = require('lib/firebase/server/ssr/handleError').default;

  try {
    const { req } = context;
    const { cookies } = req;
    const token = cookies.p_sessionId;

    if (!token) {
      // Destroy the cookie containing the token
      console.log('Invalid or revoked token');
      destroyCookie(null, 'p_sessionId', { path: '/' });

      return {
        redirect: {
          destination: '/auth/login?signUserOut=true',
          permanent: false,
        },
      };
    }

    const decodedToken = await verifyToken(token);
    const uid = decodedToken.uid;

    const userData = await getSingleDoc('userProfiles', uid);

    if (!userData) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return {
      props: {
        user: userData,
      },
    };
  } catch (error) {
    return handleError(error);
  }
};
