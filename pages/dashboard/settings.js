//* Protected Page
import React, { useState, useContext, useEffect } from 'react';

import { useRouter } from 'next/router';
import Layout from 'components/Layout';

import axios from 'axios';

import DashMenu from 'components/dashboard/dashMenu/DashMenu';

import admin from 'lib/firebase/server/config';
import { AuthContext } from 'context/AuthContext';

import useAuthGuard from 'components/auth/useAuthGuard';

import { db } from 'lib/firebase/client/config';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [uiError, setUiError] = useState('');
  const [uiMessage, setUiMessage] = useState('');

  const { user } = useContext(AuthContext);
  useAuthGuard(user);

  useEffect(() => {
    const fetchBannerMessage = async () => {
      try {
        const bannerMessageRef = collection(db, 'bannerMessage');
        const querySnapshot = await getDocs(bannerMessageRef);
        console.log(querySnapshot);
        setUiMessage(querySnapshot.data());
      } catch (error) {
        console.error('Error fetching banner message: ', error);
      }
    };

    fetchBannerMessage();
  });

  const router = useRouter();

  return (
    <Layout>
      <div className="flex">
        <div className="w-[125px]">
          <DashMenu />
        </div>
        <div className="w-full text-primary p-4 dark:text-primaryDark">
          <h2 className="text-primary dark:text-primaryDark">Settings</h2>
          <div className="text-primary dark:text-primaryDark">
            <form className="form">
              <input type="text" className="form-input"></input>
              <label className="flex">
                <input type="checkbox" className="me-2 my-auto"></input>
                <p className="my-auto">Toggle Banner</p>
              </label>
              <button className="button-primary">Update</button>
            </form>
            <div className="text-primary dark:text-primaryDark">
              {uiMessage}
            </div>
          </div>
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

    return {
      props: {},
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
