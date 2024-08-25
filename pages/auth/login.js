import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../../components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import logo from 'public/assets/images/PULogo - black.png';
import logoDark from 'public/assets/images/PULogo - white.png';
import { parseCookies, destroyCookie } from 'nookies';
import { toast } from 'react-toastify';
import { AuthContext } from 'context/AuthContext';
import { useTheme } from 'context/ThemeContext';
import { useRouter } from 'next/router';
import checkRecaptcha from 'utils/checkRecaptcha';
import Recaptcha from 'components/recaptcha/Recaptcha';
import FacebookLoginButton from 'components/auth/FacebookLoginButton';
import ProgressBar from 'components/forms/formComponents/progressBar/ProgressBar';

const Login = () => {
  const [progress, setProgress] = useState({ progress: '0%', message: '' });
  const { signIn, fbSignIn, user, loading, fetchUserProfile } =
    useContext(AuthContext);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const router = useRouter();
  const { reason } = router.query;
  const cookies = parseCookies();
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

  const onVerify = (token) => {
    setRecaptchaToken(token);
  };

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.push({
        pathname: '/',
      });
    }
  }, [user, router, loading]);

  useEffect(() => {
    if (loading) return;
    if (reason && cookies.redirect_reason) {
      toast.info(cookies.redirect_reason);
      destroyCookie(null, 'redirect_reason', { path: '/' });
      if (['session_expired', 'invalid_token', 'no_token'].includes(reason)) {
        destroyCookie(null, 'token', { path: '/' });
      }
    }
  }, [reason, cookies, user, loading]);

  const displayError = (errorMessage) => {
    return toast.error(errorMessage);
  };

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setProgress({ progress: '0%', message: '' });
    const res = await checkRecaptcha(recaptchaToken);
    console.log('checkRecaptcha response: ', res);
    if (res.success) {
      try {
        await signIn(data.email, data.password, setProgress);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    } else {
      console.error('reCAPTCHA verification failed');
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

        <h1 className="text-4xl mx-auto">Login</h1>
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
              name="password"
              placeholder="Password"
              className="form-input"
              {...register('password', {
                required: 'Password is required',
              })}
            />
            {errors.password && (
              <div className="text-accent2 text-xs">
                {errors.password.message}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="button-primary w-[200px] h-[40px] mx-auto text-xl"
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
          <ProgressBar progress={progress} />
        </div>
        <Recaptcha onVerify={onVerify} />
      </div>
    </Layout>
  );
};

export default Login;
