import React, { useState, useContext, useEffect } from 'react';

import { useRouter } from 'next/router';

import Layout from 'components/Layout';
import ConfirmationModal from 'components/forms/formComponents/confirmationModal/ConfirmationModal';
import getErrorMessage from 'utils/getErrorMessage';

import { AuthContext } from 'context/AuthContext';
import { LoadingContext } from 'context/LoadingContext';

import { useForm, Controller } from 'react-hook-form';

import axios from 'axios';

export default function Account({ user }) {
  const { loading: userLoading } = useContext(LoadingContext);
  const { signOut } = useContext(AuthContext);
  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleFormSubmit = (data) => {
    return onSubmit(data);
  };

  const onSubmit = async (data, confirmed = false) => {
    try {
      if (data.email !== user.email) {
        throw new Error('Email does not match user account');
      }

      if (data.email === user.email && !confirmed) {
        setIsModalOpen(true);
        return;
      }

      const response = await axios.post('/api/admin/deleteAccount', {
        user: user,
        email: data.email,
      });
      if (response.status === 200) {
        signOut();
        router.push({
          pathname: '/auth/login',
          query: { userProfileDeleted: 'true' },
        });
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      getErrorMessage(error);
    }
  };

  return (
    <div>
      <Layout>
        <main className="flex flex-col items-center justify-center font-mono space-y-4 p-4">
          <h1 className="text-3xl">Account</h1>
          <div className="max-w-sm w-full">
            <ConfirmationModal
              isOpen={isModalOpen}
              onCancel={() => {
                setIsModalOpen(false);
              }}
              onConfirm={() => {
                setIsModalOpen(false); // Close the modal
                onSubmit(getValues(), true); // Resume the onSubmit function with form values
              }}
              title={'Are you sure?'}
              question={`Once you delete this account, you won't be able to register this email address again. Continue?`}
            />
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="form h-64 justify-between"
            >
              <p className="text-sm">
                Type your email address to delete your account:
              </p>

              <Controller
                name="email"
                control={control}
                defaultValue=""
                placeholder={user?.email}
                rules={{
                  required: 'Email address is required',
                  validate: (value) => {
                    if (!value.trim()) {
                      return 'email address cannot be empty or contain only spaces';
                    }
                    if (value !== user.email) {
                      return 'email address must match user account';
                    }
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <input
                      className="form-input"
                      placeholder={user?.email}
                      {...field}
                    />
                    {fieldState?.error && (
                      <p className="text-accent2 dark:text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />

              <button
                type="submit"
                className="button-primary p-2"
                disabled={loading}
              >
                {loading ? 'Please wait...' : 'Delete'}
              </button>
            </form>
          </div>
        </main>
      </Layout>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const verifyToken = require('lib/firebase/server/ssr/verifyToken').default;
  const getSingleDoc = require('lib/firebase/server/ssr/getSingleDoc').default;
  const handleError = require('lib/firebase/server/ssr/handleError').default;

  try {
    const { req } = context;
    const { cookies } = req;
    const token = cookies.p_sessionId || '';
    const decodedToken = await verifyToken(token);
    const uid = decodedToken.uid;

    const userData = await getSingleDoc('userProfiles', uid);

    if (!userData) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return {
      props: {
        user: userData,
      },
    };
  } catch (error) {
    return handleError(error);
  }
};
