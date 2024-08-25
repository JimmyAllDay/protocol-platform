import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Link from 'next/link';

import { toast } from 'react-toastify';

const Registered = () => {
  const router = useRouter();

  useEffect(() => {
    const { registered } = router.query;
    if (registered) {
      toast.info('Email sent to inbox.');
    }
  }, [router.query]);

  return (
    <Layout>
      <div className="text-primary my-auto text-3xl mx-auto space-y-4 text-center">
        <h1>Password reset email sent.</h1>
        <h1>Please check your inbox.</h1>
        <h1>{`(It might take a minute or two)`}</h1>
        <Link href="/auth/login">
          <button className="button-primary mt-8 text-2xl p-1">Log In</button>
        </Link>
      </div>
    </Layout>
  );
};

export default Registered;
