import React, { useState, useContext, useEffect } from 'react';

import { useRouter } from 'next/router';
import Layout from 'components/Layout';

import axios from 'axios';

import DashMenu from 'components/dashboard/dashMenu/DashMenu';

import { AuthContext } from 'context/AuthContext';
import { LoadingContext } from 'context/LoadingContext';

import { toast } from 'react-toastify';

//TODO: use meta api to return facebook info
//TODO: use meta api to return instagram info

export default function Dashboard({ user, events, users }) {
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
    return (
      <Layout>
        <div className="">Loading...</div>;
      </Layout>
    );
  }

  const userCount = users?.length;

  return (
    <Layout>
      <div className="grid grid-cols-5 grid-rows-3 h-screen">
        <section className="col-span-1 row-span-3 col-start-1 border flex">
          <div className="w-[125px]">
            <DashMenu />
          </div>
          <h2>Col 1</h2>
        </section>
        <section className="w-full p-4 col-span-1 row-span-3 border">
          This is the main dashboard page
          <br />
          <br />
          Possible information to go here: <br />
          Users signed up over time? <br />
          Next event date <br />
          patrons attended events patrons mapped over events and music genre
          Engagement metrics re: promotional material - social posts, etc
          <br />
        </section>
        <section className="col-span-1 row-span-1 row-start-2 col-start-3 border"></section>
        <section className="border border-border dark:border-borderDark col-start-3 col-span-3 row-span-1 row-start-1 flex">
          <div className="flex ms-auto">
            <h2 className="px-4 text-2xl">Users: </h2>
            <div className="border-4 border-border dark:border-borderDark rounded-lg text-6xl me-4 p-2 w-[125px] h-[125px] flex justify-end items-end">
              {userCount}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (context) => {
  const admin = require('lib/firebase/server/config').default;
  const checkAdmin = require('lib/firebase/server/ssr/checkAdmin').default;
  const getSingleDoc = require('lib/firebase/server/ssr/getSingleDoc').default;
  const verifyToken = require('lib/firebase/server/ssr/verifyToken').default;
  const handleError = require('lib/firebase/server/ssr/handleError').default;
  const getAllDocs = require('lib/firebase/server/ssr/getAllDocs').default;

  try {
    const { req } = context;
    const { cookies } = req;
    const token = cookies.p_sessionId || '';
    const decodedToken = await verifyToken(token);
    const uid = decodedToken.uid;
    const isAdmin = await checkAdmin(uid);

    if (!isAdmin) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const userData = await getSingleDoc('userProfiles', uid);
    const events = await getAllDocs('events');
    const userProfiles = await getAllDocs('userProfiles');

    return {
      props: {
        user: userData,
        users: userProfiles,
        events: events,
      },
    };
  } catch (error) {
    return handleError(error);
  }
};
