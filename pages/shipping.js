import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from 'context/Store';
import { useRouter } from 'next/router';

export default function ShippingScreen() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;
  const router = useRouter();

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('country', shippingAddress.country);
  }, [setValue, shippingAddress]);

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, postalCode, country },
    });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
      })
    );

    router.push('/payment');
  };

  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md text-primary pt-10 space-y-6"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Shipping Address</h1>
        <div className="mb-4">
          <label htmlFor="fullName">Full Name</label>
          <input
            className="w-full bg-primary border border-white p-1 rounded"
            id="fullName"
            autoFocus
            {...register('fullName', {
              required: 'Please enter full name',
            })}
          />
          {errors.fullName && (
            <div className="text-accent2">{errors.fullName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address">Address</label>
          <input
            className="w-full bg-primary border border-white p-1 rounded"
            id="address"
            {...register('address', {
              required: 'Please enter address',
              minLength: { value: 3, message: 'Address is more than 2 chars' },
            })}
          />
          {errors.address && (
            <div className="text-accent2">{errors.address.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">City</label>
          <input
            className="w-full bg-primary border border-white p-1 rounded"
            id="city"
            {...register('city', {
              required: 'Please enter city',
            })}
          />
          {errors.city && (
            <div className="text-accent2">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">Post Code</label>
          <input
            className="w-full bg-primary border border-white p-1 rounded"
            id="postalCode"
            {...register('postalCode', {
              required: 'Please enter postal code',
            })}
          />
          {errors.postalCode && (
            <div className="text-accent2">{errors.postalCode.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="country">Country</label>
          <input
            className="w-full bg-primary border border-white p-1 rounded"
            id="country"
            {...register('country', {
              required: 'Please enter country',
            })}
          />
          {errors.country && (
            <div className="text-accent2">{errors.country.message}</div>
          )}
        </div>
        <button className="secondary-button p-1 w-full">Next</button>
      </form>
    </Layout>
  );
}

ShippingScreen.auth = true;
