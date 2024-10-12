//* Protected Page
import React, { useState, useContext, useEffect } from 'react';

import { useRouter } from 'next/router';
import Layout from 'components/Layout';

import axios from 'axios';

import DashMenu from 'components/dashboard/dashMenu/DashMenu';

import admin from 'lib/firebase/server/config';
import { AuthContext } from 'context/AuthContext';

import useAuthGuard from 'components/auth/useAuthGuard';

export default function Dashboard({ userProfiles }) {
  const [loading, setLoading] = useState(false);
  const [uiError, setUiError] = useState('');

  const [profiles, setProfiles] = useState();

  const { user } = useContext(AuthContext);
  useAuthGuard(user);

  useEffect(() => {
    setProfiles(userProfiles);
  }, []);

  const router = useRouter();

  return (
    <Layout>
      <div className="flex">
        <div className="w-[125px]">
          <DashMenu />
        </div>
        <div className="w-full text-primary p-4">
          Users
          <div className="border">
            {userProfiles.map((profile, i) => {
              return (
                <div
                  key={`userProfile${i}`}
                >{`${profile.firstName} ${profile.surname}`}</div>
              );
            })}
          </div>
          {loading && (
            <h1 className="my-auto text-xl w-1/2 flex items-center justify-center text-accent2">
              Please wait...
            </h1>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (context) => {
  const verifyToken = require('lib/firebase/server/ssr/verifyToken').default;
  const checkAdmin = require('lib/firebase/server/ssr/checkAdmin').default;
  const handleError = require('lib/firebase/server/ssr/handleError').default;
  const getAllDocs = require('lib/firebase/server/ssr/getAllDocs').default;

  const { req } = context;
  const { cookies } = req;

  const token = cookies.p_sessionId || '';

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    const userDoc = await admin
      .firestore()
      .collection('userProfiles')
      .doc(uid)
      .get();

    if (!userDoc.exists || !userDoc.data().isAdmin) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const userProfilesSnapshot = await admin
      .firestore()
      .collection('userProfiles')
      .get();
    const userProfiles = userProfilesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString(),
      };
    });

    return {
      props: {
        user: decodedToken,
        userProfiles,
      },
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};
