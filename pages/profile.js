import Layout from '../components/Layout';
import UserDetailsForm from '../components/UserDetailsForm';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0/client';
import { toast } from 'react-toastify';

export default function Profile() {
  const [upload, setUpload] = useState(false);
  const [userCanUpload, setUserCanUpload] = useState(false);
  const { user } = useUser();

  //Handle redirect if not signed in
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (!user) {
      router.push(redirect || '/');
    }
  }, [router, user, redirect]);

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-full bg-primary text-primary font-mono space-y-4">
        <h1 className="text-2xl">Profile</h1>
        <div className="max-w-xl w-full h-3/4">
          <div className="border flex max-w-xl min-h-full">
            <div className="border flex flex-col w-1/4">
              <button
                className={`${
                  upload ? 'bg-primary' : 'bg-accent bg-opacity-30 text-accent'
                }`}
                onClick={() => setUpload(false)}
              >
                Details
              </button>
              <button
                className={`${
                  upload ? 'bg-accent bg-opacity-30 text-accent' : 'bg-primary'
                }`}
                onClick={() =>
                  userCanUpload
                    ? setUpload(true)
                    : toast.error(
                        'Please submit your details before uploading a mix.'
                      )
                }
              >
                Uploads
              </button>
            </div>
            <div className="border flex flex-col w-3/4">
              {upload ? (
                <div>Upload</div>
              ) : (
                <UserDetailsForm authDetails={user} />
              )}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
