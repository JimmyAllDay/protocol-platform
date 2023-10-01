import Layout from '../components/Layout';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { AuthContext } from 'context/AuthContext';

import { useForm } from 'react-hook-form';
import { getError } from '../utils/error';

export function UserDetailsForm({ userDetails }) {
  console.log('user details form props: ', userDetails);
  const { setUserDetails } = useContext(AuthContext);

  const {
    createdAt,
    email,
    facebookName,
    firstName,
    instagramHandle,
    isCheckedFacebook,
    isCheckedInstagram,
    isCheckedPromo,
    surname,
    updatedAt,
    userProfileComplete,
    username,
    phone,
    __v,
    _id,
  } = userDetails;

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [buttonLoading, setButtonLoading] = useState(false);

  const submitHandler = async (event, allValues) => {
    event.preventDefault();
    setButtonLoading(true);
    try {
      const res = await axios.post('/api/updateUser', allValues);
      setUserDetails(res.data.updatedUser.value);
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error(getError(err));
    }
    setButtonLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit((append) => {
        append.createdAt = createdAt;
        append.updatedAt = [...updatedAt, new Date().toISOString()];
        append.userProfileComplete = true; //TODO: you probably want to update this at the time of updating the mongo document, rather than on the client
        append.__v = __v;
        append._id = _id;
        submitHandler(event, append);
      })}
      className="flex flex-col space-y-4 p-4 max-w-xl border border-primary rounded"
    >
      <div className="text-2xl flex justify-center">Details</div>
      <div className="flex flex-col justify-items-center space-y-2">
        <label htmlFor="firstName" className="flex items-center justify-center">
          First Name
        </label>
        <input
          type="text"
          className="bg-primary border border-white p-1 rounded"
          id="firstName"
          autoFocus
          defaultValue={userDetails?.firstName}
          {...register('firstName', {
            required: 'Please enter first name',
          })}
        />
        {errors.firstName && (
          <div className="text-accent2 text-xs">{errors.firstName.message}</div>
        )}
      </div>
      <div className="flex flex-col justify-items-center space-y-2">
        <label htmlFor="surname" className="flex items-center justify-center">
          Surname
        </label>
        <input
          type="text"
          className="bg-primary border border-white p-1 rounded"
          id="surname"
          defaultValue={userDetails?.surname}
          autoFocus
          {...register('surname', {
            required: 'Please enter surname',
          })}
        />
        {errors.surname && (
          <div className="text-accent2 text-xs">{errors.surname.message}</div>
        )}
      </div>
      <div className="flex flex-col justify-items-center space-y-2">
        <label htmlFor="username" className="flex items-center justify-center">
          Username
        </label>
        <input
          type="text"
          className="bg-primary border border-white p-1 rounded"
          id="username"
          autoFocus
          defaultValue={userDetails?.username}
          {...register('username', {
            required: 'Please enter a username',
            minLength: {
              value: 4,
              message: 'Username should be at least 4 characters',
            },
          })}
        />
        {errors.username && (
          <div className="text-accent2 text-xs">{errors.username.message}</div>
        )}
      </div>
      <div className="flex flex-col justify-items-center space-y-2">
        <label htmlFor="phone" className="flex items-center justify-center">
          Phone Number
        </label>
        <input
          type="tel"
          className="bg-primary border border-white p-1 rounded"
          id="phone"
          defaultValue={userDetails?.phone}
          autoFocus
          {...register('phone', {
            required: true,
            minLength: 8,
            maxLength: 13,
            message: 'Please enter a valid phone number',
          })}
        />
        {errors.phone && (
          <div className="text-accent2 text-xs">{errors.phone.message}</div>
        )}
      </div>
      <div className="flex flex-col justify-items-center space-y-2">
        <label htmlFor="email" className="flex items-center justify-center">
          Email
        </label>
        <input
          type="email"
          className="bg-primary border border-white p-1 rounded text-accentGrey"
          id="email"
          defaultValue={userDetails?.email}
          {...register('email', {
            required: 'Please enter an email address',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address',
            },
          })}
          onClick={() =>
            toast.info(`Email can't be changed right now. We're working on it.`)
          } //TODO: Email change not implemented. If the user wants to change their email, it will have to sync with Auth0.
          readOnly
        />
        {errors.email && (
          <div className="text-accent2 text-xs">{errors.email.message}</div>
        )}
      </div>
      <div className="text-3xl flex justify-center">Socials</div>
      <div className="flex flex-col justify-items-center space-y-2">
        <label htmlFor="promo" className="text-xs">
          <input
            type="checkbox"
            name="isCheckedPromo"
            className="accent-black bg-black border border-white mr-2"
            // defaultValue={userDetails?.isCheckedPromo}
            {...register('isCheckedPromo', {
              required: true,
            })}
            checked={userDetails?.isCheckedPromo}
          />
          I will assist to promote myself and protocol events by distributing
          promo material through my social media channels.
        </label>
        {errors.isCheckedPromo && (
          <div className="text-accent2 text-xs">This field is required</div>
        )}
      </div>
      <div className="flex flex-col justify-items-center space-y-2">
        <label
          htmlFor="instagramHandle"
          className="flex items-center justify-center"
        >
          Instagram Handle
        </label>
        <input
          type="text"
          className="bg-primary border border-white p-1 rounded"
          id="instagramHandle"
          defaultValue={userDetails?.instagramHandle}
          autoFocus
          {...register('instagramHandle', {
            required: 'Please enter an Instagram handle',
            pattern: {
              value: /^[a-zA-Z0-9._]{1,}$/i,
              message: 'Please enter an unbroken string',
            },
            pattern: {
              value: /^(?!@).*/,
              message:
                'Please do not enter an `@` sign at the start of your handle',
            },
          })}
        />
        {errors.instagramHandle && (
          <div className="text-accent2 text-xs">
            {errors.instagramHandle.message}
          </div>
        )}
      </div>
      <div className="flex flex-col justify-items-center space-y-2">
        <label className="text-xs">
          <input
            type="checkbox"
            name="isCheckedInstagram"
            className="accent-black bg-black border border-white mr-2"
            // defaultValue={userDetails?.isCheckedInstagram}
            {...register('isCheckedInstagram', { required: true })}
            checked={userDetails?.isCheckedInstagram}
          />
          I have followed protocol underground on instagram.
        </label>
        {errors.isCheckedInstagram && (
          <div className="text-accent2 text-xs">This field is required</div>
        )}
      </div>
      <div className="flex flex-col justify-items-center space-y-2">
        <label
          htmlFor="facebookName"
          className="flex items-center justify-center"
        >
          Facebook Name
        </label>
        <input
          type="text"
          className="bg-primary border border-white p-1 rounded"
          id="facebookName"
          defaultValue={userDetails?.facebookName}
          autoFocus
          {...register('facebookName', {
            required: 'Please enter a Facebook user name',
          })}
        />
      </div>
      <div className="flex flex-col justify-items-center space-y-2">
        <label className="text-xs">
          <input
            type="checkbox"
            name="isCheckedFacebook"
            className="accent-black bg-black border border-white mr-2"
            // defaultValue={userDetails?.isCheckedFacebook}
            {...register('isCheckedFacebook', { required: true })}
            checked={userDetails?.isCheckedFacebook}
          />
          I have followed protocol underground on facebook.
        </label>
        {errors.isCheckedFacebook && (
          <div className="text-accent2 text-xs">This field is required</div>
        )}
      </div>
      <button
        type="submit"
        className="primary-button p-1"
        onClick={handleSubmit}
        disabled={buttonLoading}
      >
        {buttonLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

export default function Profile() {
  const {
    user,
    error,
    loading,
    isLoading,
    redirect,
    userDetails,
    setUserDetails,
  } = useContext(AuthContext);

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center bg-primary text-primary font-mono space-y-4">
        <h1 className="text-3xl">Profile</h1>
        <UserDetailsForm userDetails={userDetails} />
      </main>
    </Layout>
  );
}

export const getServerSideProps = withPageAuthRequired();
