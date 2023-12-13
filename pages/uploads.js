import Layout from '../components/Layout';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { AuthContext } from 'context/AuthContext';
import axios, { Axios } from 'axios';
import { useEdgeStore } from 'lib/edgestore';
import { useForm, Controller } from 'react-hook-form';

import useSWR from 'swr';

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Uploads() {
  const { control, handleSubmit, reset } = useForm();
  const [progress, setProgress] = useState('0%');
  const [loading, setLoading] = useState(false);

  //TODO: Below userDetails destructure is for development only you will need to update before deployment, once Auth solution finalised.
  let { userDetails } = useContext(AuthContext);
  userDetails = userDetails[0];

  const { edgestore } = useEdgeStore();

  const { data, error, isLoading, mutate } = useSWR(
    '/api/user/[id]/uploadMix',
    fetcher
  );

  const fileCleanUpRef = useRef();

  async function audioUpload(file) {
    if (file) {
      try {
        const res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => {
            setProgress(`${progress}%`);
          },
        });
        return res.url;
      } catch (err) {
        console.error(err);
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      const fileUrl = await audioUpload(data.file);

      const updatedData = {
        fileUrl: fileUrl,
        firstName: userDetails.firstName,
        surname: userDetails.surname,
        username: userDetails.username,
        _id: userDetails._id,
      };

      const jsonData = JSON.stringify(updatedData);

      const res = axios.post('/api/user/audio/audioUpload', jsonData);

      console.log(res.body);
    } catch (error) {
      console.error(error);
    } finally {
      reset();
      if (fileCleanUpRef.current) {
        fileCleanUpRef.current.value = '';
      }
      setProgress('0%');
    }
  };

  const handleDelete = async (id, url) => {
    try {
      setLoadingHandler(true);
      await deleteImageFile(url);
      const res = await axios.delete(`/api/products/deleteProduct/${id}`);
      mutate(res.data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHandler(false);
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
              <div className="h-[6px] w-full border border-black rounded overflow-hidden mb-2">
                <div
                  className="h-full bg-accent transition-all duration-150"
                  style={{ width: progress }}
                ></div>
              </div>
            </div>
            <button type="submit" className="primary-button p-2">
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
        <div className="max-w-xl w-full border border-primary rounded p-4">
          Render media files here
        </div>
      </main>
    </Layout>
  );
}

// export const getServerSideProps = withPageAuthRequired();
