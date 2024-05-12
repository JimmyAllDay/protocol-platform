'use client';
import React, { useState, useContext, useEffect, useRef } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from 'components/Layout';
// import { AuthContext } from 'context/AuthContext';
import axios, { Axios } from 'axios';

import useSWR from 'swr';

import DashMenu from 'components/dashboard/DashboardMenu';

import Image from 'next/image';

import { MdOutlineEmail } from 'react-icons/md';

import useUser from '/data/useUser.js';

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function PatronsDashboard() {
  const { user, loading: userLoading } = useUser(); //TODO: Temp auth solution - this may need to be fixed
  const router = useRouter();
  //TODO: fix this when auth solution is fixed
  //TODO: this won't cover all cases
  if (user?.isAdmin === false || user === {}) {
    router.push('/');
  }

  const { data, error, isLoading, mutate } = useSWR(
    '/api/patrons/getPatrons',
    fetcher
  ); //!data - original array

  const [progress, setProgress] = useState('0%');
  const [loading, setLoading] = useState(false);
  const [uiError, setUiError] = useState(''); //?Not sure if this is needed at this point
  const [email, setEmail] = useState(''); //!email - filter value

  const handleFormChange = (e) => {
    return setEmail(e.target.value);
  };

  const setLoadingHandler = (loading) => {
    return setLoading(loading);
  };

  const handleSubmit = async () => {
    try {
      setLoadingHandler(true);

      const formData = new FormData();
      formData.append('email', email);

      const res = await axios.post('/api/patrons/createPatron', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      mutate(res.data.patrons);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHandler(false);
      setProgress('0%');
      setEmail('');
    }
  };

  const handleEnterKeyPress = (e) => {
    if (event.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoadingHandler(true);
      const res = await axios.delete(`/api/patrons/deletePatron/${id}`);
      mutate(res.data.patrons);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHandler(false);
    }
  };

  return (
    console.log(data),
    (
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
                    {(isLoading || loading) && (
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
                    {data?.length <= 0 ? (
                      <h3 className="text-primary text-xl">No patrons yet</h3>
                    ) : (
                      data?.map((patron) => {
                        return (
                          <div key={patron._id} className="flex">
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
                              onClick={() => handleDelete(patron._id)}
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
    )
  );
}
