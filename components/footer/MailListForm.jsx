'use client';
import React from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

import { addToMailList } from 'utils/addToMailList';

export default function SubscribeToMailingList() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const submitHandler = async ({ email }) => {
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
      className="flex flex-col w-full space-y-4"
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
        className="bg-primary dark:bg-primaryDark placeholder:text-accent3 dark:placeholder:text-accent2 border-backgroundDark dark:border-accent border-b p-0 text-lg"
        id="email"
      ></input>
      <button className="button-primary p-1">Subscribe</button>
      {errors.email && (
        <div className="text-accent2">{errors.email.message}</div>
      )}
    </form>
  );
}
