import React, { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import SocialLinks from 'components/footer/SocialLinks';

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

    const res = await fetch(`/api/contact`, {
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
      <div className="bg-primary min-h-full flex flex-col">
        <h1 className="mx-auto text-primary mt-20 text-7xl font-medium">
          Contact Us
        </h1>
        <div className="flex w-full text-primary mt-28 gap-28 ">
          <div className="w-1/2 flex flex-col ">
            <h3 className="text-3xl w-1/2 ms-auto">You can find us at</h3>
            <div className="mt-10 w-1/2 ms-auto text-sm flex flex-col gap-12">
              <div className="flex flex-col gap-1">
                <h5 className="font-bold">Email</h5>
                <p>admin@protocol-underground.com</p>
              </div>
              <div className="flex flex-col gap-1">
                <h5 className="font-bold">Phone Number</h5>
                <p>
                  {`Just use email for now please - we'll get back to you asap.`}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <h5 className="font-bold">Location</h5>
                <p>Fitzroy, Melbourne, VIC 3065</p>
              </div>
              <SocialLinks />
            </div>
          </div>
          <div className="text-center w-1/2 flex flex-col gap-10">
            <h3 className="text-3xl w-1/2 me-auto">Or drop us a line below</h3>
            <form
              id="contactForm"
              onSubmit={onSubmit}
              disabled={isLoading || submitted}
              className="flex flex-col gap-8 w-1/2"
            >
              <label className="flex flex-col text-sm gap-1">
                Name:*
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  disabled={isLoading || submitted}
                  className="bg-primary text-primary p-1 border placeholder-accentGrey ps-2"
                  required
                />
              </label>
              <label className="flex flex-col text-sm gap-1">
                Email:*
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  disabled={isLoading || submitted}
                  className="bg-primary text-primary p-1 border placeholder-accentGrey ps-2"
                  required
                />
              </label>
              <label className="flex flex-col text-sm gap-1">
                Phone:
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  disabled={isLoading || submitted}
                  className="bg-primary text-primary p-1 border placeholder-accentGrey ps-2"
                />
              </label>
              <label className="flex flex-col text-sm gap-1">
                Message:*
                <textarea
                  type="text"
                  name="message"
                  placeholder="Message"
                  className="bg-primary text-primary p-1 border placeholder-accentGrey ps-2"
                  rows="6"
                  cols="33"
                  disabled={isLoading || submitted}
                />
              </label>

              <button
                type="submit"
                disabled={isLoading || submitted}
                className={`${
                  submitted ? 'inactive-button' : 'primary-button'
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
      </div>
    </Layout>
  );
}
