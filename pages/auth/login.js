import { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../../components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import logo from 'public/assets/images/PULogo - white.png';
import { parseCookies, destroyCookie } from 'nookies';
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from 'context/AuthContext';
import { useRouter } from 'next/router';

import checkRecaptcha from 'utils/checkRecaptcha';
import Recaptcha from 'components/recaptcha/Recaptcha';

const Login = () => {
  const [uiMessage, setUiMessage] = useState('');
  const [progress, setProgress] = useState('0%');
  const { signIn, user, loading } = useContext(AuthContext);
  const [recaptchaToken, setRecaptchaToken] = useState('');

  const router = useRouter();

  const { reason } = router.query;
  const cookies = parseCookies();

  const onVerify = (token) => {
    setRecaptchaToken(token);
  };

  useEffect(() => {
    if (loading) return; // Wait for loading to be false before running effect
    if (user && reason !== 'session_expired') {
      router.push({
        pathname: '/',
      });
    }
  }, [user, reason, router, loading]);

  useEffect(() => {
    if (loading) return; // Wait for loading to be false before running effect
    if (reason && cookies.redirect_reason) {
      toast.info(cookies.redirect_reason);
      destroyCookie(null, 'redirect_reason', { path: '/' });
      if (
        reason === 'session_expired' ||
        reason === 'invalid_token' ||
        reason === 'no_token'
      ) {
        destroyCookie(null, 'token', { path: '/' });
      }
    }
  }, [reason, cookies, user, loading]);

  const displayError = (errorMessage) => {
    return toast.error(errorMessage);
  };

  const updateProgress = ({ progress, message }) => {
    setProgress(progress);
    setUiMessage(message);
  };

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setUiMessage('');
    const res = await checkRecaptcha(recaptchaToken);
    console.log('checkRecaptcha response: ', res);
    if (res.success) {
      try {
        await signIn(data.email, data.password, updateProgress);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    } else {
      console.error('reCAPTCHA verification failed');
    }
  };

  return (
    console.log('Recaptcha token: ', recaptchaToken),
    (
      <Layout>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-6 border text-primary w-[300px] border-primary p-4 mx-auto mt-36 rounded"
        >
          <Image src={logo} alt="logo" width={125} height={'auto'} priority />
          <h1 className="text-4xl mb-10 mx-auto">Login</h1>
          <div className="flex flex-col">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-input-primary"
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
              className="form-input-primary"
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
            className="primary-button w-[200px] h-[40px] mx-auto text-xl"
          >
            Login
          </button>
          <div className="flex justify-between">
            <div className="w-1/3 p-1 flex">
              <Link
                href="/auth/register"
                className="hover:text-accent flex flex-col"
              >
                <p className="my-auto text-sm mx-auto">Register</p>
              </Link>
            </div>
            <div className="flex flex-col w-2/3 p-1">
              <div className="w-1/2 ms-auto flex flex-col">
                <Link
                  href="/auth/reset"
                  className="hover:text-accent flex flex-col"
                >
                  <p className="ms-auto text-sm mx-auto">Forgot</p>
                  <p className="ms-auto text-sm">password?</p>
                </Link>
              </div>
            </div>
          </div>
          <div className="h-[6px] w-full border border-black rounded overflow-hidden mb-2">
            <div
              className="h-full bg-accent transition-all duration-150"
              style={{ width: progress }}
            ></div>
          </div>
        </form>
        <Recaptcha onVerify={onVerify} />
        <p className="text-accent2 mx-auto mt-4">{uiMessage}</p>
      </Layout>
    )
  );
};

export default Login;
