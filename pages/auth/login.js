//* Partially Protected Page
import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../../components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { AuthContext } from 'context/AuthContext';
import { useRouter } from 'next/router';
import FacebookLoginButton from 'components/facebook/FacebookLoginButton';
import ProgressBar from 'components/forms/formComponents/progressBar/ProgressBar';
import { useTheme } from 'context/ThemeContext';
import { useHCaptcha } from 'context/HCaptchaContext';
import Logo from 'components/logo/Logo';

import getErrorMessage from 'utils/getErrorMessage';

import showToast from 'utils/toastUtils';

const Login = () => {
  const { theme } = useTheme();
  const {
    signIn,
    fbSignIn,
    user,
    loading,
    fetchUserProfile,
    setUserProfile,
    signOut,
  } = useContext(AuthContext);

  const router = useRouter();
  const { signUserOut } = router.query;

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [progress, setProgress] = useState({ progress: '0%', message: '' });

  const { resetCaptcha, withCaptcha } = useHCaptcha();

  // Log user out based on signUserOut query params
  useEffect(() => {
    const handleLogOut = async () => {
      try {
        setUserProfile(null);
        await signOut();
      } catch (error) {
        const message = getErrorMessage(error);
        showToast(message, 'error');
      } finally {
        //Display user message
        showToast('User signed out');
        //Update query params
        const updatedQuery = { ...router.query };
        delete updatedQuery.signUserOut;
        router.replace(
          { pathname: router.pathname, query: updatedQuery },
          undefined,
          {
            shallow: true,
          }
        );
      }
    };
    if (signUserOut) {
      handleLogOut();
    }
  }, [signUserOut]);

  useEffect(() => {
    if (!loading && user && !signUserOut) {
      router.push('/');
    }
  }, [user, router, loading]);

  useEffect(() => {
    resetCaptcha();
  }, []);

  const submitHandler = async (data) => {
    setProgress({ progress: '0%', message: '' });
    try {
      // Ensure email and password are not empty
      if (!data.email || !data.password) {
        throw new Error('Email or password is missing');
      }
      // Attempt sign-in
      await signIn(data.email, data.password, setProgress);
      // Reset captcha state after successful login
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
        <Logo stacked={true} width={120} />

        <h1 className="text-4xl mx-auto">Login</h1>
        <div className="space-y-6 px-4">
          {/* <FacebookLoginButton updateProgress={setProgress} /> */}
          <form
            onSubmit={handleSubmit(handleSubmitWithCaptcha)}
            className="flex flex-col space-y-6"
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
                name="password"
                placeholder="Password"
                className="form-input"
                {...register('password', {
                  required: 'Password is required',
                })}
              />
              {errors.password && (
                <div className="text-accent2 dark:text-accent2Dark text-xs pt-1">
                  {errors.password.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="button-primary w-full h-[40px] mx-auto text-xl"
            >
              Login
            </button>
          </form>
          <div className="flex flex-col">
            <div className="flex">
              <div className="w-1/3 p-1 flex">
                <Link href="/auth/register" className="flex flex-col link">
                  <p className="my-auto text-sm mx-auto">Register</p>
                </Link>
              </div>
              <div className="flex flex-col w-2/3 p-1">
                <div className="w-1/2 ms-auto flex flex-col">
                  <Link href="/auth/reset" className="flex flex-col link">
                    <p className="ms-auto text-sm mx-auto">Forgot</p>
                    <p className="ms-auto text-sm">password?</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <ProgressBar progress={progress} />
        </div>
      </div>
    </Layout>
  );
};

export default Login;

export const getServerSideProps = async (context) => {
  const verifyToken = require('lib/firebase/server/ssr/verifyToken').default;
  const getSingleDoc = require('lib/firebase/server/ssr/getSingleDoc').default;
  const handleError = require('lib/firebase/server/ssr/handleError').default;

  try {
    const { req } = context;
    const { cookies } = req;
    const token = cookies.p_sessionId || '';

    // If a token exists, verify it and redirect the user if logged in
    if (token) {
      const decodedToken = await verifyToken(token);
      const uid = decodedToken.uid;

      try {
        const userData = await getSingleDoc('userProfiles', uid);

        // If the user data is valid, redirect to the main page
        if (userData) {
          return {
            redirect: {
              destination: '/',
              permanent: false,
            },
          };
        }
      } catch (error) {
        console.error('Invalid or revoked token');
        // Destroy the cookie if token or user data is invalid/revoked
        destroyCookie(context, 'p_sessionId', { path: '/' });
      }
    }

    // If the token doesn't exist or is invalid, let the user proceed to the login page
    return {
      props: {},
    };
  } catch (error) {
    return handleError(error);
  }
};
