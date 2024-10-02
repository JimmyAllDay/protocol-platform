import React, { useState, useContext, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import logo from 'public/assets/images/PULogo - black.png';
import logoDark from 'public/assets/images/PULogo - white.png';
import { AuthContext } from 'context/AuthContext';
import FacebookLoginButton from 'components/facebook/FacebookLoginButton';
import ProgressBar from 'components/forms/formComponents/progressBar/ProgressBar';
import { useTheme } from 'context/ThemeContext';
import { useHCaptcha } from 'context/HCaptchaContext';

import getErrorMessage from 'utils/getErrorMessage';
import showToast from 'utils/toastUtils';

const Register = () => {
  const { theme } = useTheme();
  const { createUser, fbSignIn, user, loading, fetchUserProfile } =
    useContext(AuthContext);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [progress, setProgress] = useState({ progress: '0%', message: '' });
  const router = useRouter();

  const { resetCaptcha, withCaptcha } = useHCaptcha();

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.push({
        pathname: '/',
      });
    }
  }, [user, router, loading]);

  useEffect(() => {
    resetCaptcha();
  }, []);

  const submitHandler = async (data) => {
    setProgress({ progress: '0%', message: '' });
    try {
      if (!data.email || !data.password1 || !data.password2) {
        throw new Error('Please fill in all fields');
      }
      if (data.password1 !== data.password2) {
        throw new Error('Passwords do not match');
      }

      const profile = await createUser(data.email, data.password1, setProgress);
      if (profile) {
        router.push('/auth/registered');
      }
    } catch (error) {
      console.error('Detailed Error Log:', error);
      const message = getErrorMessage(error);
      showToast(message, 'error');
    } finally {
      reset();
      resetCaptcha();
    }
  };

  const handleSubmitWithCaptcha = withCaptcha(submitHandler);

  return (
    <Layout>
      <div className="flex flex-col space-y-6 border w-[300px] border-border dark:border-borderDark p-4 mx-auto mt-36 rounded">
        {theme === 'light' ? (
          <Link href="/">
            <Image src={logo} alt="logo" width={125} height={'auto'} />
          </Link>
        ) : (
          <Link href="/">
            <Image src={logoDark} alt="logo" width={125} height={'auto'} />
          </Link>
        )}
        <h1 className="text-4xl mb-10 mx-auto">Register</h1>
        <div className="space-y-6 px-4">
          <FacebookLoginButton updateProgress={setProgress} />
          <form
            onSubmit={handleSubmit(handleSubmitWithCaptcha)}
            // onSubmit={handleSubmit(submitHandler)} //*For testing
            className="flex flex-col space-y-6 mx-auto"
          >
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
            <div className="flex flex-col">
              <input
                type="password"
                name="password1"
                placeholder="Password"
                className="form-input"
                {...register('password1', {
                  required: 'Password is required',
                })}
              />
              {errors.password1 && (
                <div className="text-accent2 dark:text-accent2Dark text-xs pt-1">
                  {errors.password1.message}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="password"
                name="password2"
                placeholder="Confirm password"
                className="form-input"
                {...register('password2', {
                  required: 'Password is required',
                })}
              />
              {errors.password2 && (
                <div className="text-accent2 dark:text-accent2Dark text-xs pt-1">
                  {errors.password2.message}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="button-primary w-full h-[40px] mx-auto text-xl"
            >
              Register
            </button>
          </form>
          <div className="flex justify-between">
            <div className="w-1/3 p-1 flex">
              <Link href="/auth/login" className="link flex flex-col">
                <p className="my-auto text-sm mx-auto">Login</p>
              </Link>
            </div>
            <div className="flex flex-col w-2/3 p-1">
              <div className="w-1/2 ms-auto flex flex-col">
                <Link href="/auth/reset" className="link flex flex-col">
                  <p className="ms-auto text-sm mx-auto">Forgot</p>
                  <p className="ms-auto text-sm">password?</p>
                </Link>
              </div>
            </div>
          </div>
          <ProgressBar progress={progress} />
        </div>
      </div>
    </Layout>
  );
};

export default Register;
