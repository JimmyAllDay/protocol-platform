import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../Layout';
import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';

import { AuthContext } from 'context/AuthContext';

import { updateUserProfile } from 'lib/firebase/client/userProfile/updateUserProfile';

import Heading from '../formComponents/heading/Heading';
import InputField from '../formComponents/inputField/InputField';
import Tooltip from '../formComponents/tooltip/Tooltip';
import SelectList from '../formComponents/selectList/SelectList';
import CheckInput from '../formComponents/checkInput/CheckInput';

import showToast from 'utils/toastUtils';

import { genreOptions } from './genreOptions';
import { equipmentOptions } from './equipmentOptions';
import { locationOptions } from './locationOptions';

import cryptoRandomString from 'crypto-random-string';
import { random } from 'lodash';

export default function ProfileForm({ user }) {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [userData, setUserData] = useState(user || {});
  const { fetchUserProfile } = useContext(AuthContext);

  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: userData?.firstName || '',
      surname: userData?.surname || '',
      displayName: userData?.displayName || '',
      phone: userData?.phone || '',
      email: userData?.email,
      equipmentUsed: userData.equipmentUsed || null,
      genresPlayed: userData.genresPlayed || null,
      isCheckedWillTravelTo: userData.isCheckedWillTravelTo || null,
      isCheckedEquipment: userData.isCheckedEquipment || false,
      isCheckedPromo: userData?.isCheckedPromo || false,
      instagramHandle: userData?.instagramHandle || '',
      isCheckedInstagram: userData?.isCheckedInstagram || false,
      tiktokHandle: userData?.tiktokHandle || false,
      isCheckedTikTok: userData?.isCheckedTikTok || false,
      facebookName: userData?.facebookName || '',
      isCheckedFacebook: userData?.isCheckedFacebook || false,
    },
  });

  const randomString = cryptoRandomString({ length: 12 });

  const submitHandler = async (data) => {
    setButtonLoading(true);
    try {
      const response = await updateUserProfile(data, userData.uid);
      if (response.error) {
        // Handle error case, possibly set an error message state to show in the UI
        console.error('Error updating document: ', response.error);
        showToast(response.error, 'error', randomString);
      } else if (response.message) {
        // Handle no-change case
        showToast(response.message, 'info');
      } else {
        await fetchUserProfile(userData.uid, true);
        setUserData(response);
        showToast(
          `Profile updated successfully. Upload a demo if you haven't already.`,
          'success',
          randomString
        );
      }
    } catch (error) {
      console.error('Unhandled error: ', error);
      showToast(
        'An error occurred while updating your profile.',
        'error',
        randomString
      );
    }
    setButtonLoading(false);
  };

  return (
    <FormProvider>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col space-y-4 p-4 max-w-xl rounded form"
      >
        <Heading label="Personal" />
        <InputField
          name="firstName"
          label="First Name"
          tooltip="Enter first name"
          validation={{ required: 'Please enter surname' }}
          autoFocus={true}
          onClick={null}
          register={register}
          errors={errors}
          readOnly={false}
        />
        <InputField
          name="surname"
          label="Surname"
          tooltip="Enter surname"
          validation={{ required: 'Please enter first name' }}
          autoFocus={false}
          onClick={null}
          register={register}
          errors={errors}
          readOnly={false}
        />
        <InputField
          name="displayName" //* This is described as 'displayName' and not 'stageName' because this identifier mirrors a property on the firebase auth object. It may be the case that you want to update this auth object with this value in the future.
          label="Stage Name"
          tooltip="Enter Stage Name. This will be your username on the Pro.ground site and will appear on promotional material."
          validation={{
            required: 'Please enter a stage name',
            minLength: {
              value: 3,
              message: 'Stage name should be at least 3 characters',
            },
          }}
          autoFocus={false}
          onClick={null}
          register={register}
          errors={errors}
          readOnly={false}
        />
        <InputField
          name="phone"
          label="Phone Number"
          tooltip="We need this to contact you for gigs"
          validation={{
            required: 'Please enter a phone number',
            minLength: {
              value: 8,
              message: 'Phone number must be at least 8 characters',
            },
            maxLength: {
              value: 13,
              message: 'Phone number must not exceed 13 characters',
            },
          }}
          autoFocus={false}
          onClick={null}
          register={register}
          errors={errors}
          readOnly={false}
        />
        <InputField
          name="email"
          label="Email"
          tooltip="You can't change this right now. Sorry."
          validation={{
            required: 'Please enter an email address',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address',
            },
          }}
          autoFocus={false}
          onClick={() => showToast(`Email can't be changed right now. Sorry.`)} //*Email change not implemented. If the user wants to change their email, it will have to sync with firebase auth.
          register={register}
          errors={errors}
          readOnly={true}
        />
        <Heading label="Logistical" />
        <SelectList
          name="genresPlayed"
          label="Genres I play"
          tooltip="This is so we can organise events themed by genre"
          control={control}
          options={genreOptions}
        />
        <SelectList
          name="equipmentUsed"
          label="Equipment I use"
          tooltip="We need to know what equipment you use, so we can set up at gigs."
          control={control}
          options={equipmentOptions}
        />
        <CheckInput
          name="isCheckedEquipment"
          label="If the equipment I use is non-standard, I can bring it to gigs."
          validation={{
            required: true,
          }}
          toolTip="If you use non-standard equipment, we ask that you consider bringing this to gigs. It might be hard for us to source otherwise."
          register={register}
          errors={errors}
        />
        <CheckInput
          name="isCheckedWillTravelTo"
          label="I can travel to Melbourne CBD for gigs."
          validation={{
            required: true,
          }}
          toolTip="We will ask you to travel to Melbourne CBD and the surrounding areas for gigs."
          register={register}
          errors={errors}
        />
        {/* //* This is commented out for mvp and may change later
        <SelectList
          name="isCheckedWillTravelTo"
          label="I can travel to"
          tooltip="We need to know how far you can travel for a gig"
          control={control}
          options={locationOptions}
        /> */}
        <Heading label="Promotional" />
        <CheckInput
          name="isCheckedPromo"
          label=" I will assist to promote myself and protocol events by
        distributing promo material through my social media channels."
          validation={{
            required: true,
          }}
          toolTip="Check the FAQ Page for more details about this"
          register={register}
          errors={errors}
        />
        <InputField
          name="instagramHandle"
          label="Instagram Handle"
          tooltip="We need this to verify you've followed us on Instagram."
          validation={{
            required: 'Please enter an Instagram handle',
            pattern: {
              value: /^[a-zA-Z0-9._]{1,}$/i,
              message: 'Please enter an unbroken string',
            },
            pattern: {
              value: /^(?!@).*/,
              message:
                'Please do not enter an `@` sign at the start of your handle',
            },
          }}
          autoFocus={false}
          onClick={null}
          register={register}
          errors={errors}
          readOnly={false}
        />
        <CheckInput
          name="isCheckedInstagram"
          label="I agree to follow pro.ground on instagram."
          validation={{
            required: true,
          }}
          toolTip="We want you to follow us so we can raise the profile of our events. This will ultimately help us promote you."
          register={register}
          errors={errors}
          url="https://www.instagram.com"
        />
        <InputField
          name="tiktokHandle"
          label="Tiktok Handle"
          tooltip="We need this to verify you've followed us on Tiktok"
          validation={{
            required: 'TikTok handle is required',
            minLength: {
              value: 2,
              message: 'TikTok handle must be at least 2 characters',
            },
            maxLength: {
              value: 24,
              message: 'TikTok handle must be no longer than 24 characters',
            },
            pattern: {
              value: /^(?!.*\.\.)(?!.*\.$)[a-z0-9._]*(@[a-zA-Z]+)[a-z0-9._]*$/,
              message:
                'TikTok handle must contain an @ symbol followed by letters. It can only contain alphanumeric characters, underscores, full stops (no consecutive or trailing periods)',
            },
          }}
          autoFocus={false}
          onClick={null}
          register={register}
          errors={errors}
          readOnly={false}
        />
        <CheckInput
          name="isCheckedTikTok"
          label="I agree to follow pro.ground on Tiktok."
          validation={{
            required: true,
          }}
          toolTip="We want you to follow us so we can raise the profile of our events. This will ultimately help us promote you."
          register={register}
          errors={errors}
          url="https://www.tiktok.com/"
        />
        <InputField
          name="facebookName"
          label="Facebook Name"
          tooltip="We need this to verify you've followed us on Facebook"
          validation={{
            required: 'Facebook username is required',
            minLength: {
              value: 5,
              message: 'Facebook username must be at least 5 characters',
            },
            pattern: {
              value: /^[a-zA-Z0-9\.]+$/,
              message:
                'Facebook username can only contain alphanumeric characters and full stops',
            },
          }}
          autoFocus={false}
          onClick={null}
          register={register}
          errors={errors}
          readOnly={false}
        />
        <CheckInput
          name="isCheckedFacebook"
          label="I agree to follow pro.ground on Facebook."
          validation={{
            required: true,
          }}
          toolTip="We want you to follow us so we can raise the profile of our events. This will ultimately help us promote you."
          register={register}
          errors={errors}
          url="https://www.facebook.com/"
        />
        <div className="w-full flex flex-col pt-6 pb-4">
          <button
            type="submit"
            className="button-primary p-1"
            onClick={handleSubmit}
            disabled={buttonLoading}
          >
            {buttonLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
