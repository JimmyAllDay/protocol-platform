import React, { useState, useContext, useEffect, useRef } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from 'components/Layout';

import DashMenu from 'components/dashboard/DashboardMenu';

import admin from 'lib/firebase/server/config';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function EventsDashboard({ user, data }) {
  //set initial events data
  const [events, setEvents] = useState(data);
  const [progress, setProgress] = useState('0%');
  const [requestLoading, setRequestLoading] = useState(false);
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

  useEffect(() => {
    setEvents(data);
  }, []);

  const fileCleanUpRef = React.useRef();
  const firestore = getFirestore();

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
    return setRequestLoading(loading);
  };

  async function imageUpload(file) {
    if (file) {
      try {
        const storageRef = ref(storage, `images/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(snapshot.ref);
        return imageUrl;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  }

  // const fetchEvents = async () => {
  //   const eventsCollection = collection(firestore, 'events');
  //   const eventsSnapshot = await getDocs(eventsCollection);
  //   const eventsList = eventsSnapshot.docs.map((doc) => ({
  //     id: doc.id,
  //     ...doc.data(),
  //   }));
  //   return eventsList;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoadingHandler(true);

      // Read the image file and convert it to base64
      const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = () => resolve(reader.result.split(',')[1]);
          reader.onerror = (error) => reject(error);
        });
      };

      const base64Image = await readFileAsBase64(formInputs.imageFile);

      const formData = {
        title: formInputs.title,
        desc: formInputs.description,
        genre: formInputs.genre,
        venueName: formInputs.venueName,
        venueAddress: formInputs.venueAddress,
        date: formInputs.date,
        time: formInputs.time,
        content: formInputs.content,
        imageFile: base64Image,
        createdBy: 'Pro.ground Admin',
        createdAt: new Date(),
      };

      const res = await axios.post('/api/events/createEvent', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const message = res.data.message;
      const events = res.data.data;

      toast.success(message);
      setEvents(events);
    } catch (error) {
      console.error(error);
      toast.error(error);
    } finally {
      setLoadingHandler(false);
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
      fileCleanUpRef.current.value = '';
    }
  };

  const handleDelete = async (id, url) => {
    try {
      setLoadingHandler(true);
      const res = await axios.delete(`/api/events/deleteEvent`, {
        data: { id, url },
      });
      const events = res.data.events;
      const message = res.data.message;
      setEvents(events);
      toast.info(message);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHandler(false);
    }
  };

  return (
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
                {requestLoading && (
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
                <label htmlFor="imageFile" className="flex w-full text-primary">
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
                  disabled={requestLoading}
                >
                  Create Event
                </button>
              </form>
              <div className="grid-cols-1 text-primary space-y-2">
                {events && events.length !== 0 ? (
                  events?.map((event) => {
                    return (
                      <div key={event._id} className="text-primary flex">
                        <Link
                          href={`/events/${event.id}`}
                          className="w-full flex hover:text-accent hover:border-t-accent hover:border-b-accent border-t border-b pe-2"
                        >
                          <h2 className="text-xl">{event.title}</h2>
                          <h2 className="ms-auto text-xl">{event.date}</h2>
                        </Link>
                        <button
                          className="border border-accent px-1 bg-accent bg-opacity-20 hover:bg-opacity-30 text-accent rounded-tr rounded-br text-xs"
                          onClick={() => handleDelete(event.id, event.imageUrl)}
                          disabled={requestLoading}
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

    const snapshot = await admin.firestore().collection('events').get();
    // Extract and store all documents in a variable
    const events = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (!userDoc.exists || !userDoc.data().isAdmin) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return {
      props: {
        user: decodedToken,
        data: events,
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
