import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import logo from 'public/assets/images/PULogo - black.png';
import logoDark from 'public/assets/images/PULogo - white.png';
import { RiArrowGoBackFill } from 'react-icons/ri';

import { toast } from 'react-toastify';
import { useTheme } from 'context/ThemeContext';

import { auth } from '/lib/firebase/client/config';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

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

  const onSubmit = async (data) => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, data.email)
      .then(() => {
        toast.info(`Email sent to ${data.email}`);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(error);
        toast.error(`${errorMessage}`);
      })
      .finally(() => {
        router.push('/auth/resetSent');
      });
  };

  return (
    <Layout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-6 border w-[300px] border-border dark:border-borderDark p-4 mx-auto mt-36 rounded"
      >
        {theme === 'light' ? (
          <Link href="/">
            <Image src={logo} alt="logo" width={125} height={'auto'} priority />
          </Link>
        ) : (
          <Link href="/">
            <Image
              src={logoDark}
              alt="logo"
              width={125}
              height={'auto'}
              priority
            />
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
            <div className="text-accent2 text-xs">{errors.email.message}</div>
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
              <div className="text-lg me-1">
                <RiArrowGoBackFill />
              </div>
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
