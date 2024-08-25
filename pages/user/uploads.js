import React, { useState, useEffect, useContext, useRef } from 'react';

import { AuthContext } from 'context/AuthContext';
import { LoadingContext } from 'context/LoadingContext';
import Layout from '../../components/Layout';

import { useRouter } from 'next/router';
import Link from 'next/link';

import { getQueryString } from '/utils/utils';

import { toast } from 'react-toastify';

import { FaPlayCircle } from 'react-icons/fa';
import { useForm, Controller } from 'react-hook-form';

import handleUpload from 'lib/firebase/client/uploads/upload.js';
import fetchUploads from 'lib/firebase/client/uploads/fetch.js';
import deleteUploads from 'lib/firebase/client/uploads/delete.js';

import ProgressBar from 'components/forms/formComponents/progressBar/ProgressBar';
import AudioFileListItem from 'components/forms/formComponents/audioFileListItem/AudioFileListItem';
import Tooltip from 'components/forms/formComponents/tooltip/Tooltip';
import ConfirmationModal from 'components/forms/formComponents/confirmationModal/ConfirmationModal';

//TODO: See if you can stream audio directly to interface using a player component - not part of MVP

export default function Uploads() {
  const { user, profileComplete } = useContext(AuthContext);
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
    if (!profileComplete) {
      router.push({
        pathname: '/user/profile',
        query: { profileComplete: 'false' },
      });
    }
  }, [profileComplete, router]);

  useEffect(() => {
    const getUploads = async (user) => {
      try {
        const res = await fetchUploads(user);
        setUploads(res);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
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
      toast.error('No file selected');
      return;
    }

    if (!mixName) {
      toast.error('Mix name is required');
      return;
    }

    if (!file.type.startsWith('audio/')) {
      toast.error('The selected file is not an audio file');
      return;
    }

    // ONLY SHOW MODAL IF BOTH FIELDS ARE FILLED AND THERE ARE EXISTING UPLOADS
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
        toast.success('Upload succeeded.');
        setUploads([...newUploads]);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
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
      toast.error(error.message);
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
            onClose={() => setIsModalOpen(false)}
            onConfirm={confirmReplace}
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
