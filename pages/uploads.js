import Layout from '../components/Layout';
import UserDetailsForm from '../components/UserDetailsForm';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default function Profile({ user }) {
  const [userCanUpload, setUserCanUpload] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(null);

  //Handle redirect if not signed in
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (!user) {
      router.push(redirect || '/');
    }
  }, [router, user, redirect]);

  if (loading) return <div>Loading...</div>;

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

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const session = await getSession(context.req, context.res);
    console.log(session);
    const user = session?.user;
    return {
      props: {
        user: user || null,
      },
    };
  },
});
