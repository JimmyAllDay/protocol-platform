'use client';
import React, { useState, useContext, useEffect } from 'react';

import { useRouter } from 'next/router';
import Layout from 'components/Layout';

import axios from 'axios';

import DashMenu from 'components/dashboard/DashboardMenu';

import admin from 'lib/firebase/server/config';

export default function Dashboard({ user, userProfiles }) {
  const [loading, setLoading] = useState(false);
  const [uiError, setUiError] = useState('');

  const [profiles, setProfiles] = useState();

  useEffect(() => {
    setProfiles(userProfiles);
  }, []);

  const router = useRouter();

  if (user?.isAdmin === false || user === {}) {
    router.push('/');
  }

  return (
    console.log(profiles),
    (
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
    )
  );
}

export const getServerSideProps = async (context) => {
  const { req } = context;
  const { cookies } = req;

  // Assuming you store the Firebase Auth ID token in a cookie called 'token'
  const token = cookies.token || '';

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
