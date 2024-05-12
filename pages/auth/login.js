import { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Layout from '../../components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import logo from 'public/assets/images/PULogo - white.png';

import { toast } from 'react-toastify';

import { signInWithEmailAndPassword } from 'firebase/auth';

import { AuthContext } from 'context/AuthContext';
import { useRouter } from 'next/router';

const Register = () => {
  const [uiMessage, setUiMessage] = useState('');
  const [progress, setProgress] = useState('0%');
  const { signIn, user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push({
        pathname: '/',
      });
    }
  }, [user, router]);

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
    try {
      await signIn(data.email, data.password, updateProgress);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    // console.log('login user profile: ', user),
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
      <p className="text-accent2 mx-auto mt-4">{uiMessage}</p>
    </Layout>
  );
};

export default Register;
