import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import logo from 'public/assets/images/PULogo - black.png';
import logoDark from 'public/assets/images/PULogo - white.png';

import showToast from 'utils/toastUtils';
import { useTheme } from 'context/ThemeContext';

import { auth } from '/lib/firebase/client/config';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

import { useHCaptcha } from 'context/HCaptchaContext';

const Reset = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [uiMessage, setUiMessage] = useState('');
  const router = useRouter();
  const { theme } = useTheme();

  const { resetCaptcha, withCaptcha } = useHCaptcha();

  useEffect(() => {
    resetCaptcha();
  }, []);

  const submitHandler = async (data) => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, data.email)
      .then(() => {
        showToast(`email sent to ${user.email}`);
      })
      .catch((error) => {
        const message = getErrorMessage(error);
        showToast(message, 'error');
      })
      .finally(() => {
        router.push('/auth/resetSent');
        resetCaptcha();
      });
  };

  const handleSubmitWithCaptcha = withCaptcha(submitHandler);

  return (
    <Layout>
      <form
        onSubmit={handleSubmit(handleSubmitWithCaptcha)}
        className="flex flex-col space-y-6 border w-[300px] border-border dark:border-borderDark p-4 mx-auto mt-36 rounded"
      >
        {theme === 'light' ? (
          <Link href="/">
            <Image src={logo} alt="logo" width={125} height={'auto'} />
          </Link>
        ) : (
          <Link href="/">
            <Image src={logoDark} alt="logo" width={125} height={'auto'} />
          </Link>
        )}
        <h1 className="text-4xl mb-10 mx-auto text-center">Password Reset</h1>
        <div className="flex flex-col">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-input"
            {...register('email', {
              required: 'Email is required',
            })}
          />
          {errors.email && (
            <div className="text-accent2 dark:text-accent2Dark text-xs pt-1">
              {errors.email.message}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="button-primary w-[200px] h-[40px] mx-auto text-xl"
        >
          Send
        </button>
        <div className="flex justify-between">
          <div className="w-2/3 p-1 flex">
            <Link href="/auth/login" className="link flex">
              <p className="my-auto text-sm mx-auto">Back to Login</p>
            </Link>
          </div>
        </div>
      </form>
      <p className="text-accent2 mx-auto mt-4">{uiMessage}</p>
    </Layout>
  );
};

export default Reset;
