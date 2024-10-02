import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Layout from '../../components/Layout';

import { sendEmailVerification, signOut, getAuth } from 'firebase/auth';

import showToast from 'utils/toastUtils';
import getErrorMessage from 'utils/getErrorMessage';

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
      try {
        const auth = await getAuth();
        const user = auth.currentUser;
        if (!user || user === null) {
          router.push('/');
          signOut(auth);
        }
        if (user?.emailVerified) {
          router.push('auth/login');
        }
        if (!user?.emailVerified) {
          setUser(user);
        }
      } catch (error) {
        const message = getErrorMessage(error);
        showToast(message, 'error');
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

  //TODO:Clean this function up - it looks like you're handling error message conversion in the clickHandler
  const clickHandler = async () => {
    try {
      await sendEmailVerification(user);
      showToast(`email sent to ${user.email}`);
    } catch (error) {
      const message = getErrorMessage(error);
      showToast(message, 'error');
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
