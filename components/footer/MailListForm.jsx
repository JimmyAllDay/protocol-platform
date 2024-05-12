'use client';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

import { addToMailList } from 'lib/firebase/client/mailingList';

export default function SubscribeToMailingList() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const submitHandler = async ({ email }) => {
    //TODO: there is currently no security on this function other than client side validation - you should update it when you get a chance.
    try {
      const added = await addToMailList(email);
      if (added) toast.info('Added to mailing list');
    } catch (error) {
      toast.error('Error adding to mail list. Please wait and try again.');
    } finally {
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col w-full ps-2 pe-8 space-y-4"
    >
      <p>Join the Protocol mailing list for updates</p>
      <input
        type="email"
        {...register('email', {
          required: 'Please enter email',
          pattern: {
            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
            message: 'Please enter valid email',
          },
        })}
        placeholder="protocol@underground.com"
        className="input-field bg-primary border-b border-primary p-0 text-lg tracking-wider"
        id="email"
      ></input>
      <button className="secondary-button p-1">Subscribe</button>
      {errors.email && (
        <div className="text-accent2">{errors.email.message}</div>
      )}
    </form>
  );
}
