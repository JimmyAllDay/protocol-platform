import React, { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import SocialLinksHorizontal from 'components/socialLinks/SocialLinksHorizonal';

export default function Contact() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors when a new request starts
    setSubmitted(false); // Clear previous submission;

    const name = event.target[0].value;
    const email = event.target[1].value;
    const phone = event.target[2].value;
    const message = event.target[3].value;

    console.log(name, email, phone, message);

    const res = await fetch(`/api/contact/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        message,
      }),
    });

    if (!res.ok) {
      setError(
        'There has been an error. Please send and email to admin@protocol-underground.com.'
      );
      return;
    }
    e.target.reset();
    setSubmitted(true);
    setIsLoading(false);
  }

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
                Just use email for now please - we'll get back to you asap.
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
            onSubmit={onSubmit}
            disabled={isLoading || submitted}
            className="flex flex-col space-y-8 max-w-sm"
          >
            <h3 className="text-2xl md:text-3xl h-20">
              Or drop us a line here:
            </h3>
            <label className="flex flex-col gap-1 font-bold">
              Name:*
              <input
                type="text"
                name="name"
                placeholder="Name"
                disabled={isLoading || submitted}
                className="form-input-contact"
                required
              />
            </label>
            <label className="flex flex-col gap-1 font-bold">
              Email:*
              <input
                type="email"
                name="email"
                placeholder="Email"
                disabled={isLoading || submitted}
                className="form-input-contact"
                required
              />
            </label>
            <label className="flex flex-col gap-1 font-bold">
              Phone:
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                disabled={isLoading || submitted}
                className="form-input-contact"
              />
            </label>
            <label className="flex flex-col gap-1 font-bold">
              Message:*
              <textarea
                type="text"
                name="message"
                placeholder="Message"
                className="form-input-contact"
                rows="6"
                cols="33"
                disabled={isLoading || submitted}
              />
            </label>

            <button
              type="submit"
              disabled={isLoading || submitted}
              className={`${
                submitted ? 'button-inactive' : 'button-primary'
              } p-1`}
            >
              {isLoading ? 'Sending...' : submitted ? 'Submitted' : 'Submit'}
            </button>
            {error && <div className="text-accent2 text-sm">{error}</div>}
            {submitted && (
              <div className="text-accent text-sm">{`Form submitted. We'll be in touch soon.`}</div>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
}
