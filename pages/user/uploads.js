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
import deleteUpload from 'lib/firebase/client/uploads/delete.js';

//TODO: See if you can stream audio directly to interface using a player component - not part of mvp

export default function Uploads() {
  const { user, profileComplete } = useContext(AuthContext);
  const { loading: userLoading } = useContext(LoadingContext);

  const [progress, setProgress] = useState({ progress: '0%', message: '' });
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [uploadedFileUrl, setUploadedFileUrl] = useState([]);
  const fileCleanUpRef = useRef();

  const { control, handleSubmit, reset } = useForm();

  const router = useRouter();

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
    console.log('form submission data: ', data);
    const file = data.file;
    if (!file) {
      console.error('No file selected');
      toast.error('No file selected');
      return;
    }
    if (!file.type.startsWith('audio/')) {
      console.error('The file is not an audio file');
      toast.error('The selected file is not an audio file');
      return;
    }

    try {
      setLoading(true);
      const res = await handleUpload(file, user, setProgress);
      const newUploads = res.uploads;
      setUploads(newUploads);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setProgress({ progress: '0%', message: '' });
      setLoading(false);
    }
  };

  const handleDelete = async (uid, url) => {
    try {
      setLoading(true);
      const res = await deleteUpload(uid, url);
      setUploads(res);
    } catch (error) {
      console.error(error);
    } finally {
      setProgress({ progress: '0%', message: '' });
      setLoading(false);
    }
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center bg-primary text-primary font-mono space-y-4">
        <h1 className="text-3xl">Uploads</h1>
        <div className="max-w-xl w-full border border-primary rounded">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col p-4 space-y-4 "
          >
            <div className="flex flex-col space-y-2">
              <label className="flex flex-col" htmlFor="uploadInput">
                Mix name:
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  placeholder="(Required)"
                  rules={{ required: 'Mix name is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <input
                        className="form-input"
                        placeholder="(Required)"
                        {...field}
                      />
                      {fieldState?.error && (
                        <p className="text-accent2">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </label>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="flex flex-col" htmlFor="uploadInput">
                Select Audio File:
                <Controller
                  name="file"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Audio file is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <input
                        type="file"
                        className="file-upload-form-input"
                        onChange={(e) => field.onChange(e.target.files[0])}
                        ref={(e) => {
                          field.ref(e);
                          fileCleanUpRef.current = e;
                        }}
                      />
                      {fieldState?.error && (
                        <p className="text-accent2">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </label>
            </div>
            <button
              type="submit"
              className="primary-button p-2"
              disabled={loading}
            >
              {loading ? 'Please wait...' : 'Submit'}
            </button>
            <div className="h-[6px] w-full border border-black rounded overflow-hidden mb-2">
              <div
                className="h-full bg-accent transition-all duration-150"
                style={{ width: progress.progress }}
              ></div>
            </div>
            <p className="text-accent2 text-sm">{progress.message}</p>
          </form>
        </div>
        <div className="max-w-xl w-full rounded">
          {uploads.length === 0 ? (
            <div>
              <p className="text-primary text-lg">Upload a mix</p>
            </div>
          ) : (
            uploads.map((mix, i) => {
              return (
                <div key={`${user._id}-mix-${i}`} className="flex">
                  <div className="text-primary flex border-t border-s border-b rounded-tl rounded-bl w-full p-1">
                    <h2 className="text-md my-auto ms-2">{mix.name}</h2>
                  </div>
                  <Link
                    href={mix.url}
                    className="text-accent ms-auto border-t border-b border-s border-accent py-1 px-3 bg-accent bg-opacity-20 hover:bg-opacity-30 flex"
                    target="_blank"
                  >
                    <div className="text-3xl flex my-auto">
                      <FaPlayCircle />
                    </div>
                  </Link>
                  <button
                    className="border border-accent px-1 bg-accent bg-opacity-20 hover:bg-opacity-30 text-accent rounded-tr rounded-br text-xs ms-auto"
                    onClick={() => handleDelete(user.uid, mix.url)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              );
            })
          )}
        </div>
        {loading || userLoading ? (
          <h1 className="text-2xl text-accent2">Please wait...</h1>
        ) : null}
      </main>
    </Layout>
  );
}
