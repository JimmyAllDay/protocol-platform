'use client';
import React, { useState, useContext, useEffect, useRef } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from 'components/Layout';
import axios, { Axios } from 'axios';

import DashMenu from 'components/dashboard/dashMenu/DashMenu';

import Image from 'next/image';

import { MdOutlineEmail } from 'react-icons/md';

import admin from 'lib/firebase/server/config';
import { getAllDocs } from 'lib/firebase/server/queries/getAllDocs';

//TODO: does the delete function work? How should it work?
//TODO: You should set up a QR code so people can scan when they arrive.
//TODO: Error handling for different errors in getServerSideProps needs updating. Error handling for failure of coded token will be different to if.the patrons collection isn't fetched

export default function PatronsDashboard({ user, patronsList, eventsList }) {
  const router = useRouter();

  if (user?.isAdmin === false || user === {}) {
    router.push('/');
  }

  const [progress, setProgress] = useState('0%');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [patrons, setPatrons] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setPatrons(patronsList);
  }, []);

  useEffect(() => {
    setEvents(eventsList);
  }, []);

  const handleFormChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    try {
      setLoading(true);

      const res = await axios.post('/api/patrons/createPatron', {
        email: email,
      });
      setPatrons(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setEmail('');
    }
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await axios.delete(`/api/patrons/deletePatron/${id}`);
      setPatrons(res.data.patrons);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex">
        <div className="w-[125px]">
          <DashMenu />
        </div>
        <div className="w-full text-primary p-4">
          <div className="text-primary">
            <div className="flex flex-col">
              <div>
                <div className="flex px-10 p-4">
                  <h1 className="text-primary my-auto text-xl w-1/4">
                    Add Patron
                  </h1>
                  {loading && (
                    <h1 className="my-auto text-xl w-1/2 flex items-center justify-center text-accent2">
                      Please wait...
                    </h1>
                  )}
                </div>

                <div className="h-[6px] w-full border border-black rounded overflow-hidden mb-2">
                  <div
                    className="h-full bg-accent transition-all duration-150"
                    style={{ width: progress }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <form
                  className="flex flex-col bg-primary space-y-2"
                  onSubmit={handleSubmit}
                >
                  <select className="form-input">
                    <option>Select an event</option>
                    <option>Drop down item</option>
                  </select>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    className="form-input"
                    placeholder="Add email"
                    onChange={handleFormChange}
                    onKeyDown={handleEnterKeyPress}
                    required
                  ></input>
                  <p className="text-xs text-accent3">
                    * Press enter to submit
                  </p>
                </form>
                <div className="rounded text-primary flex flex-col space-y-4">
                  {patrons?.length === 0 ? (
                    <h3 className="text-primary text-xl">No patrons yet</h3>
                  ) : (
                    patrons?.map((patron) => {
                      return (
                        <div key={patron.id} className="flex">
                          <div className="w-full border-t border-b p-1 flex">
                            <p className="text-sm">{patron.email}</p>
                            <p
                              className={`ms-auto text-lg ${
                                patron.onMailList
                                  ? 'text-accent'
                                  : 'text-accent2'
                              }`}
                            >
                              <MdOutlineEmail />
                            </p>
                          </div>
                          <button
                            className="ms-auto text-xs border p-1 rounded-r border-accent hover:cursor-pointer text-accent bg-accent bg-opacity-20 hover:bg-opacity-30"
                            onClick={() => handleDelete(patron.id)}
                          >
                            Delete
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (context) => {
  const { req } = context;
  const { cookies } = req;

  // Assuming you store the Firebase Auth ID token in a cookie called 'token'
  const token = cookies.token || '';

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    const userDoc = await admin
      .firestore()
      .collection('userProfiles')
      .doc(uid)
      .get();

    if (!userDoc.exists || !userDoc.data().isAdmin) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const patrons = await getAllDocs('patrons');
    const events = await getAllDocs('events');

    return {
      props: {
        user: decodedToken,
        patronList: patrons,
        eventsList: events,
      },
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};
