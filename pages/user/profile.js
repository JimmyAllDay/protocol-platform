import Layout from '../../components/Layout';
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import ProfileForm from 'components/profile/profileForm/ProfileForm';

import { AuthContext } from 'context/AuthContext.jsx';

import { toast } from 'react-toastify';

export default function Profile() {
  const { user, loading } = useContext(AuthContext);

  const router = useRouter();
  const { profileComplete } = router.query;

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [router, user]);

  useEffect(() => {
    if (profileComplete === 'false') {
      toast.info('Please complete your profile before uploading a demo.');
    }
  }, [profileComplete]);

  if (loading) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center bg-primary text-primary font-mono space-y-4">
        <h1 className="text-3xl">Profile</h1>
        <ProfileForm user={user} />
      </main>
    </Layout>
  );
}
