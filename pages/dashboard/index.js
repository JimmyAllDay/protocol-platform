import React, { useState, useContext, useEffect } from 'react';

import { useRouter } from 'next/router';
import Layout from 'components/Layout';

import axios from 'axios';

import DashMenu from 'components/dashboard/dashMenu/DashMenu';

import { AuthContext } from 'context/AuthContext';
import { LoadingContext } from 'context/LoadingContext';

// pages/protected-page.js
import admin from 'lib/firebase/server/config';

//TODO: use meta api to return facebook info
//TODO: use meta api to return instagram info

export default function Dashboard({ user }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user || (user && !user.isAdmin)) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="flex">
        <div className="w-[125px]">
          <DashMenu />
        </div>
        <div className="w-full p-4">
          This is the main dashboard page
          <br />
          <br />
          Possible information to go here: <br />
          Number of users <br />
          Users signed up over time? <br />
          Next event date <br />
          patrons attended events patrons mapped over events and music genre
          Engagement metrics re: promotional material - social posts, etc
          <br />
        </div>
      </div>
    </Layout>
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

    const userData = userDoc.data();

    if (!userDoc.exists || !userData.isAdmin) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    // Convert Firestore Timestamp to a serializable format
    const serializableUserData = {
      ...userData,
      createdAt: userData.createdAt.toDate().toISOString(),
      updatedAt: userData.updatedAt.toDate().toISOString(),
      // Convert any other Timestamp fields similarly
    };

    return {
      props: {
        user: serializableUserData,
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
