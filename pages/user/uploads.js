//* Protected Page
import React, { useState, useEffect, useContext, useRef } from 'react';

import { AuthContext } from 'context/AuthContext';
import { LoadingContext } from 'context/LoadingContext';
import Layout from '../../components/Layout';

import { useRouter } from 'next/router';
import Link from 'next/link';

import { getQueryString } from '/utils/utils';

import getErrorMessage from 'utils/getErrorMessage';
import showToast from 'utils/toastUtils';

import { FaPlayCircle } from 'react-icons/fa';
import { useForm, Controller } from 'react-hook-form';

import handleUpload from 'lib/firebase/client/uploads/upload.js';
import fetchUploads from 'lib/firebase/client/uploads/fetch.js';
import deleteUploads from 'lib/firebase/client/uploads/delete.js';

import ProgressBar from 'components/forms/formComponents/progressBar/ProgressBar';
import AudioFileListItem from 'components/forms/formComponents/audioFileListItem/AudioFileListItem';
import Tooltip from 'components/forms/formComponents/tooltip/Tooltip';
import ConfirmationModal from 'components/forms/formComponents/confirmationModal/ConfirmationModal';
import sendMixUploadNotice from 'lib/emailjs/sendMixUploadNotice';

import cryptoRandomString from 'crypto-random-string';

import useAuthGuard from 'components/auth/useAuthGuard';

//TODO: See if you can stream audio directly to interface using a player component - not part of MVP

export default function Uploads() {
  const { user } = useContext(AuthContext);
  useAuthGuard(user);
  const { loading: userLoading } = useContext(LoadingContext);

  const router = useRouter();

  const { control, handleSubmit, reset, getValues, watch } = useForm();
  const [uploads, setUploads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ progress: '0%', message: '' });
  const [pendingUpload, setPendingUpload] = useState(null);
  const fileCleanUpRef = useRef();

  // WATCH THE INPUT VALUES TO DETERMINE IF THEY'RE FILLED
  const watchMixName = watch('name');
  const watchFile = watch('file');

  useEffect(() => {
    const getUploads = async (user) => {
      try {
        const res = await fetchUploads(user);
        setUploads(res);
      } catch (error) {
        console.error(error);
        const message = getErrorMessage(error);
        showToast(message, 'error');
      }
    };
    if (user) {
      getUploads(user);
    }
  }, [user]);

  const onSubmit = async (data) => {
    const mixName = data.name;
    const file = data.file[0]; // Access the file array properly

    if (!file) {
      showToast('No file selected', 'error');
      return;
    }

    if (!mixName) {
      showToast('Mix name is required', 'error');
      return;
    }

    if (!file.type.startsWith('audio/')) {
      showToast('The selected file is not an audio file', 'error');
      return;
    }

    // Only show modal if both fields are filled and there are existing uploads
    if (uploads.length !== 0 && mixName.trim() && file) {
      setPendingUpload({ mixName, file }); // Store the pending upload data
      setIsModalOpen(true);
      return;
    }

    // If no existing uploads, proceed directly with the upload
    await handleFileUpload(mixName, file);
  };

  const handleFileUpload = async (mixName, file) => {
    try {
      setLoading(true);
      const res = await handleUpload(mixName, file, user, setProgress);
      const newUploads = res.uploads;
      if (newUploads) {
        setUploads([...newUploads]);
        showToast('Upload succeeded.', 'success');
      }
      await sendMixUploadNotice(user.email);
    } catch (error) {
      console.error(error);
      const message = getErrorMessage(error);
      showToast(message, 'error', 'error-toast');
    } finally {
      // Always clear the file input and reset the form state, whether successful or not
      if (fileCleanUpRef.current) {
        fileCleanUpRef.current.value = null;
      }
      reset(); // Clear form state
      setProgress({ progress: '0%', message: '' });
      setLoading(false);
    }
  };

  const confirmReplace = async () => {
    setIsModalOpen(false);

    if (pendingUpload) {
      // Proceed with the upload using the stored pending data
      await handleFileUpload(pendingUpload.mixName, pendingUpload.file);
      setPendingUpload(null); // Clear the pending upload data
    }
  };

  const handleDelete = async (uid, url) => {
    try {
      setLoading(true);
      const res = await deleteUploads(uid, url);
      setUploads(res);
    } catch (error) {
      console.error(error);
      const message = getErrorMessage(error);
      showToast(message, 'error');
    } finally {
      setProgress({ progress: '0%', message: '' });
      setLoading(false);
    }
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center font-mono space-y-4 p-4">
        <h1 className="text-3xl">Uploads</h1>
        <div className="max-w-xl w-full">
          <ConfirmationModal
            isOpen={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onConfirm={confirmReplace}
            title={'Replace File?'}
            question={
              'A file is currently uploaded. Do you want to replace it?'
            }
          />
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className="flex flex-col space-y-2">
              <label className="flex flex-col" htmlFor="uploadInput">
                Mix name:
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  placeholder="(Required)"
                  rules={{
                    required: 'Mix name is required',
                    maxLength: {
                      value: 40,
                      message: 'Mix name cannot exceed 40 characters',
                    },
                    validate: (value) => {
                      if (!value.trim()) {
                        return 'Mix name cannot be empty or contain only spaces';
                      }
                      return true;
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <input
                        className="form-input"
                        placeholder="(Required)"
                        {...field}
                      />
                      {fieldState?.error && (
                        <p className="text-accent2 dark:text-accent2Dark">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </label>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="flex" htmlFor="uploadInput">
                Select Audio File:
                <Tooltip message="We have only allowed users to upload 1 mix each at this time. Choose your best one!" />
              </label>
              <Controller
                name="file"
                control={control}
                defaultValue=""
                rules={{ required: 'Audio file is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <input
                      type="file"
                      accept="audio/*"
                      className="form-input-file-upload"
                      onChange={(e) => {
                        field.onChange(e.target.files); // Update the React Hook Form state with the file
                        if (
                          uploads.length !== 0 &&
                          watchMixName.trim() &&
                          e.target.files.length
                        ) {
                          setPendingUpload({
                            mixName: watchMixName,
                            file: e.target.files[0],
                          });
                          setIsModalOpen(true);
                        }
                      }}
                      ref={(e) => {
                        field.ref(e);
                        fileCleanUpRef.current = e;
                      }}
                    />
                    {fieldState?.error && (
                      <p className="text-accent2 dark:text-accent2Dark">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <button
              type="submit"
              className="button-primary p-2"
              disabled={loading}
            >
              {loading ? 'Please wait...' : 'Submit'}
            </button>

            <ProgressBar progress={progress} />
          </form>
        </div>
        <div className="max-w-xl w-full">
          {uploads.length === 0 && !loading ? (
            <div className="flex">
              <p className="text-lg mx-auto text-primary dark:text-primaryDark">
                Upload a demo mix
              </p>
            </div>
          ) : (
            uploads.map((mix, i) => {
              return (
                <AudioFileListItem
                  key={`${mix.mixName}-${i}`}
                  user={user}
                  mix={mix}
                  handleDelete={handleDelete}
                  loading={loading}
                />
              );
            })
          )}
        </div>
        {loading || userLoading ? (
          <h1 className="text-2xl text-primary dark:text-accent2Dark">
            Please wait...
          </h1>
        ) : null}
      </main>
    </Layout>
  );
}

export const getServerSideProps = async (context) => {
  const verifyToken = require('lib/firebase/server/ssr/verifyToken').default;
  const getSingleDoc = require('lib/firebase/server/ssr/getSingleDoc').default;
  const handleError = require('lib/firebase/server/ssr/handleError').default;

  const randomString = cryptoRandomString({ length: 12 });

  try {
    const { req } = context;
    const { cookies } = req;
    const token = cookies.p_sessionId || '';
    const decodedToken = await verifyToken(token);
    const uid = decodedToken.uid;

    const userManagementData = await getSingleDoc('userManagement', uid);

    if (!userManagementData.userProfileUpdates.profileComplete) {
      return {
        redirect: {
          destination: `/user/profile?profileComplete=false&redirect=${randomString}`,
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  } catch (error) {
    return handleError(error);
  }
};
