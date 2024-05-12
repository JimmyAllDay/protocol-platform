'use client';
import React, { useState, useContext, useEffect } from 'react';

import { useRouter } from 'next/router';
import Layout from 'components/Layout';

import axios from 'axios';

import DashMenu from 'components/dashboard/DashboardMenu';

import useUser from '/data/useUser.js';

export default function Dashboard() {
  const { user, loading: userLoading } = useUser(); //TODO: Temp auth solution - this may need to be fixed
  const [loading, setLoading] = useState(false);
  const [uiError, setUiError] = useState('');

  const setDataHandler = (data) => {
    return setData(data);
  };

  const setLoadingHandler = (loading) => {
    return setLoading(loading);
  };

  const router = useRouter();
  //TODO: fix this when auth solution is fixed
  //TODO: this won't cover all cases
  if (user?.isAdmin === false || user === {}) {
    router.push('/');
  }

  return (
    <Layout>
      <div className="flex">
        <div className="w-[125px]">
          <DashMenu />
        </div>
        <div className="w-full text-primary p-4">
          This is the USERS dashboard page
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
