'use client';
import React, { useState, useContext, useEffect, useRef } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from 'components/Layout';
import axios, { Axios } from 'axios';

import useSWR from 'swr';

import DashMenu from 'components/dashboard/DashboardMenu';

import useUser from '/data/useUser.js';

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function EventsDashboard() {
  const { user, loading: userLoading } = useUser(); //TODO: Temp auth solution - this may need to be fixed
  const router = useRouter();
  //TODO: fix this when auth solution is fixed
  //TODO: this won't cover all cases
  if (user?.isAdmin === false || user === {}) {
    router.push('/');
  }

  const { data, error, isLoading, mutate } = useSWR(
    '/api/events/getEvents',
    fetcher
  );

  const fileCleanUpRef = React.useRef();

  const [progress, setProgress] = useState('0%');
  const [loading, setLoading] = useState(false);
  const [formInputs, setFormInputs] = useState({
    title: '',
    description: '',
    genre: '',
    venueName: '',
    venueAddress: '',
    date: '',
    time: '',
    content: '',
    imageFile: '',
  });

  const handleFormChange = (e) => {
    setFormInputs({
      ...formInputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormInputs({
      ...formInputs,
      imageFile: file,
    });
  };

  const setLoadingHandler = (loading) => {
    return setLoading(loading);
  };

  async function imageUpload(file) {
    if (file) {
      try {
        return res.url;
      } catch (err) {
        console.error(err);
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoadingHandler(true);

      const imageUrl = await imageUpload(formInputs.imageFile);

      const formData = new FormData();
      formData.append('title', formInputs.title);
      formData.append('desc', formInputs.description);
      formData.append('genre', formInputs.genre);
      formData.append('venueName', formInputs.venueName);
      formData.append('venueAddress', formInputs.venueAddress);
      formData.append('date', formInputs.date);
      formData.append('time', formInputs.time);
      formData.append('content', formInputs.content);
      formData.append('imageUrl', imageUrl);
      formData.append('createdBy', 'Pro.ground Admin');

      const res = await axios.post('/api/events/createEvent', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      mutate(res.data.events);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHandler(false);
      setProgress('0%');
      setFormInputs({
        title: '',
        description: '',
        genre: '',
        venueName: '',
        venueAddress: '',
        date: '',
        time: '',
        content: '',
        imageFile: '',
      });
      //? - This cleans up the file input ref
      fileCleanUpRef.current.value = '';
    }
  };

  async function deleteImageFile(url) {
    console.log('delete function url: ', url);
    try {
    } catch (err) {
      console.error(err);
    }
  }

  const handleDelete = async (id, url) => {
    try {
      setLoadingHandler(true);
      await deleteImageFile(url);
      const res = await axios.delete(`/api/events/deleteEvent/${id}`);
      return mutate(res.data.events);
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
            <div className="flex flex-col">
              <div>
                <div className="flex px-10 p-4">
                  <h1 className="text-primary my-auto text-xl w-1/4">
                    Add Event
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
                    type="text"
                    placeholder="Title"
                    className="form-input"
                    name="title"
                    onChange={handleFormChange}
                    value={formInputs.title}
                    required
                  ></input>
                  <input
                    type="text"
                    placeholder="Brief description"
                    className="form-input"
                    name="description"
                    onChange={handleFormChange}
                    value={formInputs.description}
                    required
                  ></input>
                  <select
                    className="form-input"
                    name="genre"
                    onChange={handleFormChange}
                    value={formInputs.genre}
                    required
                  >
                    <option value="" disabled hidden>
                      Select Genre
                    </option>
                    <option>{`Drum'n'Bass`}</option>
                    <option>{`House`}</option>
                    <option>{`Hip Hop`}</option>
                    <option>{`Dub Step`}</option>
                    <option>{`Chill Out`}</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Venue name"
                    className="form-input"
                    name="venueName"
                    onChange={handleFormChange}
                    value={formInputs.venueName}
                    required
                  ></input>
                  <input
                    type="text"
                    placeholder="Venue address"
                    className="form-input"
                    name="venueAddress"
                    onChange={handleFormChange}
                    value={formInputs.venueAddress}
                    required
                  ></input>

                  <div className="flex space-x-2">
                    <label htmlFor="date" className="w-1/2 text-primary flex">
                      <p className="m-auto">Date:</p>
                      <input
                        type="date"
                        id="datePicker"
                        className="form-input w-full ms-4"
                        name="date"
                        onChange={handleFormChange}
                        value={formInputs.date}
                        required
                      ></input>
                    </label>
                    <label htmlFor="time" className="w-1/2 text-primary flex">
                      <p className="my-auto ms-1">Time:</p>
                      <input
                        type="time"
                        id="timePicker"
                        className="form-input w-full ms-4"
                        name="time"
                        onChange={handleFormChange}
                        value={formInputs.time}
                        required
                      ></input>
                    </label>
                  </div>
                  <textarea
                    placeholder="Content"
                    className="form-input"
                    cols="30"
                    rows="10"
                    name="content"
                    onChange={handleFormChange}
                    value={formInputs.content}
                    required
                  ></textarea>
                  <label
                    htmlFor="imageFile"
                    className="flex w-full text-primary"
                  >
                    <p className="m-auto">Image</p>
                    <input
                      type="file"
                      className="w-full ms-4 file-upload-form-input"
                      name="imageFile"
                      onChange={handleImageChange}
                      ref={fileCleanUpRef}
                      required
                    ></input>
                  </label>
                  <button
                    className="primary-button p-2"
                    disabled={isLoading || loading}
                  >
                    Create Event
                  </button>
                </form>
                <div className="grid-cols-1 text-primary space-y-2">
                  {data && data.length !== 0 ? (
                    data?.map((event) => {
                      return (
                        <div key={event._id} className="text-primary flex">
                          <Link
                            href={`/events/${event._id}`}
                            className="w-full flex hover:text-accent hover:border-t-accent hover:border-b-accent border-t border-b pe-2"
                          >
                            <h2 className="text-xl">{event.title}</h2>
                            <h2 className="ms-auto text-xl">{event.date}</h2>
                          </Link>
                          <button
                            className="border border-accent px-1 bg-accent bg-opacity-20 hover:bg-opacity-30 text-accent rounded-tr rounded-br text-xs"
                            onClick={() =>
                              handleDelete(event._id, event.imageUrl)
                            }
                            disabled={isLoading}
                          >
                            Delete
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-accent text-center">
                      Add an event to see details
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  );
}
