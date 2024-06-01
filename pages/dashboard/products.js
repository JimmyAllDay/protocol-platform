'use client';
import React, { useState, useContext, useEffect, useRef } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from 'components/Layout';

import DashMenu from 'components/dashboard/DashboardMenu';

import Image from 'next/image';

import axios from 'axios';
import admin from 'lib/firebase/server/config';

import { getAllDocs } from 'lib/firebase/server/queries/getAllDocs';

export function DashboardProduct({
  id,
  imageUrl,
  name,
  category,
  date,
  productType,
  handleDelete,
}) {
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex justify-between ps-2 h-[75px] overflow-hidden">
      <Link href={`products/${id}`} className="w-full">
        <div
          className="flex border-t border-b hover:border-accent hover:text-accent h-full"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className={`p-1 flex items-center`}>
            <Image
              src={imageUrl}
              alt=""
              width={70}
              height={70}
              className={`transition-transform duration-300 ${
                hover && 'scale-125'
              }`}
              style={{
                objectFit: 'cover',
                overflow: 'hidden',
              }}
              priority
            />
          </div>
          <div className="grid grid-cols-3 w-full">
            <h2 className="text-xl flex ms-4 col-span-2 p-1 mb-auto w-full">
              {name}
            </h2>
            <h2 className="text-xs me-2 p-1 pt-2 col-span-1 ms-auto mb-auto">
              {productType}
            </h2>

            <h2 className="col-span-3 ms-4 p-1 mt-auto text-sm">
              {category === 'Ticket'
                ? `Event date: ${date}`
                : `Date added: ${date}`}
            </h2>
          </div>
        </div>
      </Link>
      <button
        className="border border-accent px-1 bg-accent bg-opacity-20 hover:bg-opacity-30 text-accent rounded-tr rounded-br text-xs"
        onClick={() => handleDelete(id, imageUrl)}
        disabled={loading}
      >
        Delete
      </button>
    </div>
  );
}

export default function ProductsDashboard(user, data) {
  const router = useRouter();
  //TODO: fix this when auth solution is fixed
  //TODO: this won't cover all cases
  if (user?.isAdmin === false || user === {}) {
    router.push('/');
  }

  const fileCleanUpRef = React.useRef();

  const [progress, setProgress] = useState('0%');
  const [loading, setLoading] = useState(false);
  const [uiError, setUiError] = useState(''); //?Not sure if this is needed at this point
  const [formInputs, setFormInputs] = useState({
    name: '',
    productType: '',
    price: '',
    description: '',
    date: '',
    imageUrl: '',
  });

  const [products, setProducts] = useState([]);

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
      formData.append('name', formInputs.name);
      formData.append('productType', formInputs.productType);
      formData.append('price', formInputs.price);
      formData.append('description', formInputs.description);
      formData.append('date', formInputs.date);
      formData.append('imageUrl', imageUrl);

      const res = await axios.post('/api/products/createProduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      mutate(res.data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHandler(false);
      setProgress('0%');
      setFormInputs({
        name: '',
        productType: '',
        price: '',
        description: '',
        date: '',
        image: '',
      });
      //? - This cleans up the file input ref
      fileCleanUpRef.current.value = '';
    }
  };

  async function deleteImageFile(url) {
    try {
    } catch (err) {
      //TODO: Use Toast to display error
      console.error(err);
    }
  }

  //TODO: Product delete function isn't working properly - it throws an error.
  const handleDelete = async (id, url) => {
    try {
      setLoadingHandler(true);
      await deleteImageFile(url);
      const res = await axios.delete(`/api/products/deleteProduct/${id}`);
      return mutate(res.data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHandler(false);
    }
  };

  return (
    console.log('products data: ', data),
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
                      Add Product
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
                    <input
                      type="text"
                      placeholder="Product/event name"
                      className="form-input"
                      name="name"
                      onChange={handleFormChange}
                      value={formInputs.name}
                      required
                    ></input>
                    <select
                      className="form-input"
                      name="productType"
                      onChange={handleFormChange}
                      value={formInputs.productType}
                      required
                    >
                      <option value="" disabled hidden>
                        Select Type
                      </option>
                      <option>Ticket</option>
                      <option>Merch</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Price"
                      className="form-input"
                      name="price"
                      onChange={handleFormChange}
                      value={formInputs.price}
                      required
                    ></input>

                    <textarea
                      type="text"
                      rows="10"
                      cols="30"
                      placeholder="Description"
                      className="form-input"
                      name="description"
                      onChange={handleFormChange}
                      value={formInputs.venueName}
                      required
                    ></textarea>
                    <label htmlFor="date" className=" text-primary flex">
                      <p className="m-auto w-1/6">Date:</p>
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
                    <label
                      htmlFor="imageFile"
                      className="flex w-full text-primary"
                    >
                      <p className="m-auto w-1/6">Image:</p>
                      <input
                        type="file"
                        className="w-full ms-4 file-upload-form-input"
                        name="imageFile"
                        onChange={handleImageChange}
                        ref={fileCleanUpRef}
                        required
                      ></input>
                    </label>
                    <button className="primary-button p-2" disabled={loading}>
                      Submit
                    </button>
                  </form>
                  <div className="rounded text-primary flex flex-col space-y-4">
                    {products?.length !== 0 ? (
                      products.map((product) => {
                        return (
                          <DashboardProduct
                            key={product.id}
                            id={product.id}
                            imageUrl={product.imageUrl}
                            name={product.name}
                            productType={product.productType}
                            date={product.date}
                            handleDelete={handleDelete}
                          />
                        );
                      })
                    ) : (
                      <p className="text-accent text-center">
                        Add a product to see details
                      </p>
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

    const products = await getAllDocs('products');

    console.log('getServerSideProps: ', products);

    return {
      props: {
        user: decodedToken,
        data: products,
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
