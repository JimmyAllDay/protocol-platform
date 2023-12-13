'use client';
import React, { useState, useContext, useEffect } from 'react';

import { useRouter } from 'next/router';
import Layout from 'components/Layout';
import { AuthContext } from 'context/AuthContext';
import axios from 'axios';

import DashMenu from 'components/dashboard/DashboardMenu';

export default function Dashboard() {
  const { userDetails } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [uiError, setUiError] = useState('');

  const setDataHandler = (data) => {
    return setData(data);
  };

  const setLoadingHandler = (loading) => {
    return setLoading(loading);
  };

  const router = useRouter();
  if (userDetails.isAdmin === false || userDetails === {}) {
    console.log('router push activated');
    router.push('/');
  }

  return (
    console.log(userDetails),
    (
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
    )
  );
}
