import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Layout from '../../components/Layout';

import { sendEmailVerification, signOut, getAuth } from 'firebase/auth';

import { toast } from 'react-toastify';

const NotVerified = () => {
  const [user, setUser] = useState(null);
  const [uiMessage, setUiMessage] = useState('');
  const router = useRouter();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await getAuth();
      const user = auth.currentUser;
      console.log(user);
      if (!user || user === null) {
        router.push('/');
        signOut(auth); //TODO:Error: do I need to handle errors here?
      }
      if (user?.emailVerified) {
        router.push('auth/login');
      }
      if (!user?.emailVerified) {
        setUser(user);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const handleBlur = () => {
      //TODO: Placeholder for blur event - will have to clean this up
      console.log('Page blurred');
      user;
      router.push('/');
    };

    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const clickHandler = async () => {
    try {
      await sendEmailVerification(user);
      toast.info(`email sent to ${user.email}`);
    } catch (error) {
      if (error.message.includes('Firebase: Error (auth/too-many-requests)')) {
        toast.error('Too many requests');
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <Layout>
      <div className="w-1/2 mx-auto mt-36 space-y-8">
        <h1 className="text-primary my-auto text-3xl mx-auto text-center">
          Email address not verified
        </h1>
        <h1 className="text-primary my-auto text-3xl mx-auto text-center">
          Please check your inbox or request a new verification email
        </h1>
        <div className="flex flex-col w-1/2 mx-auto space-y-4">
          <button
            type="submit"
            className="button-primary h-[35px] text-lg"
            value="Send Email"
            onClick={clickHandler}
          >
            Send New Email
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NotVerified;
