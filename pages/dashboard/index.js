'use client';
import React, { useState, useContext, useEffect } from 'react';

import { useRouter } from 'next/router';
import Layout from 'components/Layout';

import axios from 'axios';

import DashMenu from 'components/dashboard/DashboardMenu';

import useUser from '/data/useUser.js';

//TODO: fix auth solution
//TODO: ensure route to admin page is protected (loading spinner, redirect)
//TODO: use meta api to return facebook info
//TODO: use meta api to return instagram info
//TODO: protect upload routes
//TODO: get user profile and social details on backend interface
//TODO: get git working properly for firebase implementation
//TODO: Temp auth solution - this may need to be fixed

export default function Dashboard() {
  const { user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [uiError, setUiError] = useState('');

  const setDataHandler = (data) => {
    return setData(data);
  };

  const setLoadingHandler = (loading) => {
    return setLoading(loading);
  };

  const router = useRouter();

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
          This is the main dashboard page
        </div>
      </div>
    </Layout>
  );
}
