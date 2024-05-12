import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

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
      <div className="text-primary my-auto text-3xl mx-auto space-y-4">
        <h1>Almost there.</h1>
        <h1>Please verify the email sent to your inbox, then sign in.</h1>
      </div>
    </Layout>
  );
};

export default Registered;
