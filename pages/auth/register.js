import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import logo from 'public/assets/images/PULogo - black.png';
import logoDark from 'public/assets/images/PULogo - white.png';
import { AuthContext } from 'context/AuthContext';
import FacebookLoginButton from 'components/auth/FacebookLoginButton';
import { useTheme } from 'context/ThemeContext';
import ProgressBar from 'components/forms/formComponents/progressBar/ProgressBar';

import { toast } from 'react-toastify';

const Register = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [uiMessage, setUiMessage] = useState('');
  const [progress, setProgress] = useState({ progress: '0%', message: '' });
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const { createUser, fbSignIn, user, loading, fetchUserProfile } =
    useContext(AuthContext);

  const { theme } = useTheme();

  useEffect(() => {
    const checkFbSdk = setInterval(() => {
      if (typeof FB !== 'undefined') {
        setSdkLoaded(true);
        clearInterval(checkFbSdk);
      }
    }, 100);

    return () => clearInterval(checkFbSdk);
  }, []);

  const router = useRouter();

  const displayError = (errorMessage) => {
    return toast.error(errorMessage);
  };

  const pushRedirect = (path) => {
    return router.push(path);
  };

  const onSubmit = async (data) => {
    if (data.password1 === data.password2) {
      setProgress({
        progress: '0%',
        message: 'Please wait.',
      });
      try {
        const profile = await createUser(
          data.email,
          data.password1,
          setProgress
        );
        if (profile) {
          router.push('/auth/registered');
        }
      } catch (error) {
        console.error(error);
        displayError(error);
      }
    } else {
      displayError('Passwords do not match');
    }
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6 border w-[300px] border-border dark:border-borderDark p-4 mx-auto mt-36 rounded">
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
        <h1 className="text-4xl mb-10 mx-auto">Register</h1>
        <FacebookLoginButton
          sdkLoaded={sdkLoaded}
          recaptchaToken={recaptchaToken}
          updateProgress={setProgress}
          fbSignIn={fbSignIn}
          fetchUserProfile={fetchUserProfile}
          router={router}
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
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
              <div className="text-accent2 text-xs">{errors.email.message}</div>
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
              <div className="text-accent2 text-xs">
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
              <div className="text-accent2 text-xs">
                {errors.password2.message}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="button-primary w-[200px] h-[40px] mx-auto text-xl"
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
      <p className="text-accent2 mx-auto mt-4">{uiMessage}</p>
    </Layout>
  );
};

export default Register;
