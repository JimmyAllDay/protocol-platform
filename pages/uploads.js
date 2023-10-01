import axios from 'axios';
import Layout from '../components/Layout';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { AuthContext } from 'context/AuthContext';

//AudioUploadForm.js
import { useForm } from 'react-hook-form';

export function AudioUploadForm({ email }) {
  const { register, handleSubmit } = useForm();

  const [buttonLoading, setButtonLoading] = useState(false);

  const submitHandler = async (event, allValues) => {
    event.preventDefault();
    console.log('form Values: ', allValues);
    setButtonLoading(true);
    try {
      const res = await axios.post('/api/uploadMix', allValues);
      console.log(res);
      // You'll need to set values here
      // toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error(getError(err));
    }
    setButtonLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit((append) => {
        append.userEmail = email;
        submitHandler(event, append);
      })}
      className="flex flex-col p-4 space-y-4 "
    >
      <div className="flex flex-col space-y-2">
        <label className="flex flex-col" htmlFor="uploadInput">
          Mix name:
        </label>
        <input
          id="mixname"
          type="text"
          placeholder="(Optional)"
          {...register('name')}
          className="bg-primary border border-white p-1 rounded"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="flex flex-col" htmlFor="uploadInput">
          Select Audio File:
        </label>
        <input
          id="uploadInput"
          type="file"
          accept="audio/*"
          {...register('audio')}
          className="border border-accent bg-accent bg-opacity-10 hover:bg-opacity-20 text-accent rounded-lg p-2 hover:cursor-pointer "
        />
      </div>
      <button type="submit" className="primary-button p-2">
        {buttonLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

export default function Uploads() {
  //Get relevant props
  const { userDetails } = useContext(AuthContext);
  const { userProfileComplete, email } = userDetails;
  //Handle redirect if user profile not completed
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (!userProfileComplete) {
      toast.info('User profile must be complete before uploading');
      setRedirecting(true);
      setTimeout(() => router.push(redirect || '/profile'), 3000);
    }
    return () => setRedirecting(false);
  }, [userProfileComplete, redirect, router]);

  if (redirecting) {
    return (
      <Layout>
        <main className="flex flex-col items-center justify-center min-h-full bg-primary text-primary font-mono space-y-4">
          <h1 className="text-3xl">
            Redirecting... <br />
            Please wait...
          </h1>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center bg-primary text-primary font-mono space-y-4">
        <h1 className="text-3xl">Uploads</h1>
        <div className="max-w-xl w-full border border-primary rounded">
          <AudioUploadForm email={email} />
        </div>
        <div className="max-w-xl w-full border border-primary rounded p-4">
          Render media players here
        </div>
      </main>
    </Layout>
  );
}

export const getServerSideProps = withPageAuthRequired();
