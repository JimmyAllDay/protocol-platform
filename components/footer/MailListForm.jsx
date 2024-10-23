import React, { useState, useEffect } from 'react';
import showToast from 'utils/toastUtils';
import { useForm } from 'react-hook-form';

import { addToMailList } from 'utils/addToMailList';
import { useHCaptcha } from 'context/HCaptchaContext';

export default function SubscribeToMailingList() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const { resetCaptcha, withCaptcha } = useHCaptcha();

  const submitHandler = async ({ email }) => {
    try {
      const added = await addToMailList(email);
      if (added) showToast('You have been added to the mailing list');
    } catch (error) {
      showToast(
        'Error adding to mail list. Please wait and try again.',
        'error'
      );
    } finally {
      reset();
      resetCaptcha();
    }
  };

  const handleSubmitWithCaptcha = withCaptcha(submitHandler);

  return (
    <form
      onSubmit={handleSubmit(handleSubmitWithCaptcha)}
      className="flex flex-col w-full space-y-4"
    >
      <p>Join the Pro.ground mailing list for updates</p>
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
