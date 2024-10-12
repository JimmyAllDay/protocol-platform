//* Public Page
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import Link from 'next/link';
import SocialLinksHorizontal from 'components/socialLinks/SocialLinksHorizonal';
import showToast from 'utils/toastUtils';
import { useHCaptcha } from 'context/HCaptchaContext';
import getErrorMessage from 'utils/getErrorMessage';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { resetCaptcha, withCaptcha } = useHCaptcha();

  useEffect(() => {
    resetCaptcha();
  }, []);

  // Submit handler
  const submitHandler = async (data) => {
    setLoading(true);
    setSubmitted(false); // Clear previous submission

    try {
      const res = await fetch(`/api/contact/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Send form data from React Hook Form
      });

      if (!res.ok) {
        throw new Error(
          'There has been an error. Please send an email to admin@protocol-underground.com.'
        );
      }
      showToast(
        `Your message has been sent. We'll be in touch soon.`,
        'success'
      );
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      const message = getErrorMessage(error);
      showToast(message, 'error');
      setLoading(false);
    } finally {
      reset(); // Reset form fields
      setLoading(false);
    }
  };

  const handleSubmitWithCaptcha = withCaptcha(submitHandler);

  return (
    <Layout>
      <div className="bg-primary dark:bg-primaryDark min-h-full grid grid-cols-2 gap-24">
        <h1 className="mx-auto text-primary dark:text-primaryDark mt-20 text-5xl md:text-7xl font-medium col-span-2">
          Contact Us
        </h1>

        <div className="flex flex-col col-span-2 lg:col-span-1 order-1 p-8 text-center items-center lg:items-end">
          <div className="flex flex-col max-w-xs space-y-8">
            <h3 className="text-3xl h-20">You can find us at</h3>
            <div className="flex flex-col">
              <h5 className="font-bold me-auto">Email</h5>
              <p className="me-auto">admin@protocol-underground.com</p>
            </div>
            <div className="flex flex-col">
              <h5 className="font-bold me-auto">Phone Number</h5>
              <p className="me-auto text-left">
                Just use email for now please - we&apos;ll get back to you asap.
              </p>
            </div>
            <div className="flex flex-col">
              <h5 className="font-bold me-auto">Location</h5>
              <p className="me-auto">Fitzroy, Melbourne, VIC 3065</p>
            </div>
            <div className="lg:flex lg:me-auto">
              <SocialLinksHorizontal />
            </div>
          </div>
        </div>

        <div className="items-center text-center flex flex-col gap-10 col-span-2 lg:col-span-1 order-2 p-8 lg:items-start mb-24 lg:mb-0">
          <form
            id="contactForm"
            onSubmit={handleSubmit(handleSubmitWithCaptcha)} // Use React Hook Form's handleSubmit
            disabled={loading || submitted}
            className="flex flex-col space-y-8 max-w-sm"
          >
            <h3 className="text-2xl md:text-3xl h-20">
              Or drop us a line here:
            </h3>

            <label className="flex flex-col gap-1 font-bold">
              Name:*
              <input
                type="text"
                placeholder="Name"
                disabled={loading || submitted}
                className="form-input-contact"
                {...register('name', { required: 'Name is required' })} // Register field with validation
              />
              {errors.name && (
                <span className="text-accent2 text-sm">
                  {errors.name.message}
                </span>
              )}
            </label>

            <label className="flex flex-col gap-1 font-bold">
              Email:*
              <input
                type="email"
                placeholder="Email"
                disabled={loading || submitted}
                className="form-input-contact"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <span className="text-accent2 text-sm">
                  {errors.email.message}
                </span>
              )}
            </label>

            <label className="flex flex-col gap-1 font-bold">
              Phone:
              <input
                type="tel"
                placeholder="Phone Number"
                disabled={loading || submitted}
                className="form-input-contact"
                {...register('phone')}
              />
            </label>

            <label className="flex flex-col gap-1 font-bold">
              Message:*
              <textarea
                placeholder="Message"
                className="form-input-contact"
                rows="6"
                disabled={loading || submitted}
                {...register('message', { required: 'Message is required' })}
              />
              {errors.message && (
                <span className="text-accent2 text-sm">
                  {errors.message.message}
                </span>
              )}
            </label>

            <button
              type="submit"
              disabled={loading || submitted}
              className={`${
                submitted ? 'button-inactive' : 'button-primary'
              } p-1`}
            >
              {loading ? 'Sending...' : submitted ? 'Submitted' : 'Submit'}
            </button>

            {submitted && (
              <div className="text-accent text-sm">{`Form submitted. We'll be in touch soon.`}</div>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
}
