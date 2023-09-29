import axios from 'axios';
import Layout from '../components/Layout';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { AuthContext } from 'context/AuthContext';

export default function Uploads() {
  const { userDetails } = useContext(AuthContext);
  console.log(userDetails);

  const { userProfileComplete } = userDetails;
  console.log('uploads - user profile complete: ', userProfileComplete);
  //Handle redirect if user profile not completed
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (!userProfileComplete) {
      toast.info('User profile must be complete before uploading');
      // router.push(redirect || '/profile');
    }
  }, [userProfileComplete, redirect, router]);

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-full bg-primary text-primary font-mono space-y-4">
        <h1 className="text-3xl">Uploads</h1>
        <div className="max-w-xl w-full h-3/4 border border-primary">
          Uploads form goes here
        </div>
      </main>
    </Layout>
  );
}

export const getServerSideProps = withPageAuthRequired();
