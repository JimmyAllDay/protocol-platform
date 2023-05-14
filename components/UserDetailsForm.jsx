import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getError } from '../utils/error';

export default function UserDetailsForm({ userData, authDetails }) {
  const [isCheckedInstagram, setIsCheckedInstagram] = useState(false);
  const [isCheckedFacebook, setIsCheckedFacebook] = useState(false);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ userData });

  const submitHandler = async ({
    firstName,
    surname,
    username,
    phoneNumber,
    email,
    isCheckedPromo,
    instagram,
    isCheckedInstagram,
    facebook,
    isCheckedFacebook,
  }) => {
    event.preventDefault();

    console.log('Submit button clicked');

    try {
      await axios.post('/api/userDetails', {
        firstName,
        surname,
        username,
        phoneNumber,
        email,
        isCheckedPromo,
        instagram,
        isCheckedInstagram,
        facebook,
        isCheckedFacebook,
      });
    } catch (err) {
      console.log(err);
      toast.error(getError(err));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col space-y-4 p-4 border"
    >
      <div className="text-3xl flex justify-center">Details</div>
      <div className="flex flex-col justify-items-center space-y-2">
        <label htmlFor="firstName" className="flex items-center justify-center">
          First Name
        </label>
        <input
          type="text"
          className="bg-primary border border-white p-1 rounded"
          id="firstName"
          autoFocus
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
          defaultValue={authDetails?.nickname}
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
          autoFocus
          {...register('phoneNumber', {
            required: 'Please enter a phone number',
            pattern: {
              message: 'Please enter a valid phone number',
            },
          })}
        />
        {errors.phoneNumber && (
          <div className="text-accent2 text-xs">
            {errors.phoneNumber.message}
          </div>
        )}
      </div>
      <div className="flex flex-col justify-items-center space-y-2">
        <label htmlFor="email" className="flex items-center justify-center">
          Email
        </label>
        <input
          type="email"
          className="bg-primary border border-white p-1 rounded"
          id="email"
          defaultValue={authDetails?.email}
          autoFocus
          {...register('email', {
            required: 'Please enter an email address',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address',
            },
          })}
        />
        {errors.email && (
          <div className="text-accent2 text-xs">{errors.email.message}</div>
        )}
      </div>
      {/* 
        //? You may not need to verify password at this point. Research through the Auth0 docs to see how hard it is to do. Also, Auth0 must have a solution for this - it has to be a common problem.
        <div className="flex flex-col justify-items-center space-y-2">
          <label
            htmlFor="password"
            className="flex items-center justify-center"
          >
            Password
          </label>
          <input
            type="password"
            className="bg-primary border border-white p-1 rounded"
            id="password"
            {...register('password', {
              required: 'Please enter a password',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long',
              },
              maxLength: {
                value: 30,
                message: 'Password cannot be more than 30 characters long',
              },
            })}
          />
          {errors.password && (
            <div className="text-accent2 text-xs">{errors.password.message}</div>
          )}
          </div> */}

      <div className="text-3xl flex justify-center">Socials</div>
      <div className="flex flex-col justify-items-center space-y-2">
        <label htmlFor="promo" className="text-xs">
          <input
            type="checkbox"
            name="isCheckedPromo"
            className="accent-black bg-black border border-white"
            onClick={() => setIsCheckedPromo(!isCheckedPromo)}
            {...register('isCheckedPromo', {
              required: true,
            })}
          />
          I will assist to promote myself and protocol events by distributing
          promo material through my social media channels.
        </label>
        {errors.isCheckedPromo && (
          <div className="text-accent2 text-xs">This field is required</div>
        )}
      </div>
      <div className="flex flex-col justify-items-center space-y-2">
        <label htmlFor="instagram" className="flex items-center justify-center">
          Instagram Handle
        </label>
        <input
          type="text"
          className="bg-primary border border-white p-1 rounded"
          id="instagram"
          autoFocus
          {...register('instagram', {
            required: 'Please enter an Instagram handle',
            pattern: {
              value: /^[a-zA-Z0-9._]{1,}$/i,
              message: 'Please enter a valid Instagram handle',
            },
          })}
        />
        {errors.instagram && (
          <div className="text-accent2 text-xs">{errors.instagram.message}</div>
        )}
      </div>
      <div className="flex flex-col justify-items-center space-y-2">
        <label>
          <input
            type="checkbox"
            name="isCheckedInstagram"
            className="accent-black bg-black border border-white"
            {...register('isCheckedInstagram', { required: true })}
          />
          I have followed protocol.underground on instagram.
        </label>
        {errors.isCheckedInstagram && (
          <div className="text-accent2 text-xs">This field is required</div>
        )}
      </div>
      <div className="flex flex-col justify-items-center space-y-2">
        <label htmlFor="facebook" className="flex items-center justify-center">
          Facebook Name
        </label>
        <input
          type="text"
          className="bg-primary border border-white p-1 rounded"
          id="facebook"
          autoFocus
          {...register('facebook', {
            required: 'Please enter a Facebook user name',
          })}
        />
      </div>
      <div className="flex flex-col justify-items-center space-y-2">
        <label>
          <input
            type="checkbox"
            name="isCheckedFacebook"
            {...register('isCheckedFacebook', { required: true })}
          />
          I have followed protocol.underground on facebook.
        </label>
        {errors.isCheckedFacebook && (
          <div className="text-accent2 text-xs">This field is required</div>
        )}
      </div>
      <button
        type="submit"
        className="primary-button p-1"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </form>
  );
}
