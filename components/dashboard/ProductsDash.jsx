import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

export default function ProductsDash({
  products,
  setDataHandler,
  loading,
  setLoadingHandler,
}) {
  console.log('dashboard products page: ', products);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target[0].value;
    const slug = e.target[1].value;
    const productType = e.target[2].value;
    const price = e.target[3].value;
    const description = e.target[4].value;
    const image = e.target[5].files[0];

    try {
      console.log(name, slug, productType, price, description, image);
      setLoadingHandler(true);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug);
      formData.append('productType', productType);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('image', image, image.name);

      const res = await axios.post('/api/products/createProduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // setDataHandler(res.data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHandler(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoadingHandler(true);
      const res = await axios.delete(`/api/products/deleteProduct/${id}`);
      setDataHandler((data = { ...data, products: res.data.products }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHandler(false);
    }
  };

  return (
    console.log('products: ', products),
    (
      <div className="text-primary">
        <div className="flex flex-col">
          <div className="flex px-10 p-4">
            <h1 className="text-primary my-auto text-xl w-1/4">Add Product</h1>
            {loading && (
              <h1 className="my-auto text-xl w-1/2 flex items-center justify-center text-accent2">
                Please wait...
              </h1>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <form
              className="flex flex-col space-y-2 px-10"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="Product name"
                className="form-input"
              ></input>
              <input
                type="text"
                placeholder="Slug"
                className="form-input"
              ></input>
              <select className="form-input">
                <option disabled>Select Item</option>
                <option>Ticket</option>
                <option>T-Shirt</option>
                <option>Hat</option>
                <option>Merchandise</option>
              </select>

              <input
                type="text"
                placeholder="Price"
                className="form-input"
              ></input>

              <textarea
                type="text"
                rows="10"
                cols="30"
                placeholder="Description"
                className="form-input"
              ></textarea>
              <label className="flex w-full">
                <p className="my-auto">Image</p>
                <input
                  type="file"
                  className="file-upload-form-input w-full ms-4"
                ></input>
              </label>
              <button className="primary-button p-2" inactive={loading}>
                Submit
              </button>
            </form>
            <div className="border border-accent rounded text-primary p-2 flex flex-col space-y-2">
              {products?.map((product) => {
                return (
                  <Link
                    key={product._id}
                    className="border rounded"
                    href={`events/${product._id}`}
                  >
                    <Image
                      src={product.image}
                      alt=""
                      width={120}
                      height={150}
                    />
                    <h2 className="text-md">{product.name}</h2>
                    <h2 className="ms-auto text-md">{product.slug}</h2>

                    <button
                      className="border border-accent px-1 bg-accent bg-opacity-20 hover:bg-opacity-30 text-accent rounded-tr rounded-br text-xs"
                      onClick={() => handleDelete(product._id)}
                      inactive={loading}
                    >
                      Delete
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    )
  );
}
