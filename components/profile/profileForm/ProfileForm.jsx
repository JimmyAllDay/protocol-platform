import Layout from '../../Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';

import { updateUserProfile } from 'lib/firebase/client/userProfile/updateUserProfile';

import Heading from './heading/Heading';
import InputField from './inputField/InputField';
import Tooltip from './tooltip/Tooltip';
import SelectList from './selectList/SelectList';
import CheckInput from './checkInput/CheckInput';

import { toast } from 'react-toastify';

import { genreOptions } from './genreOptions';
import { equipmentOptions } from './equipmentOptions';
import { locationOptions } from './locationOptions';

export default function ProfileForm({ user }) {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [userData, setUserData] = useState(user || {});

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
      willTravelTo: userData.willTravelTo || null,
      isCheckedEquipment: userData.isCheckedEquipment || false,
      isCheckedPromo: userData?.isCheckedPromo || false,
      instagramHandle: userData?.instagramHandle || '',
      isCheckedInstagram: userData?.isCheckedInstagram || false,
      facebookName: userData?.facebookName || '',
      isCheckedFacebook: userData?.isCheckedFacebook || false,
      stageName: userData?.stageName || '',
    },
  });

  const submitHandler = async (data) => {
    setButtonLoading(true);
    console.log('form data: ', data);

    try {
      const response = await updateUserProfile(data, userData.uid);
      if (response.error) {
        // Handle error case, possibly set an error message state to show in the UI
        console.error('Error updating document: ', response.error);
        toast.error(response.error);
      } else if (response.message) {
        // Handle no-change case
        toast.info(response.message);
      } else {
        // If the document was successfully updated
        setUserData(response);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Unhandled error: ', error);
      toast.error('An error occurred while updating your profile.');
    }

    setButtonLoading(false);
  };

  return (
    <FormProvider>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col space-y-4 p-4 max-w-xl border border-primary rounded"
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
          name="displayName" //* This is described as 'displayName' and not 'userName' because this identifier mirrors a property on the firebase auth object. It may be the case that you want to update this auth object with this value in the future.
          label="Username"
          tooltip="Enter Username"
          validation={{
            required: 'Please enter a username',
            minLength: {
              value: 3,
              message: 'Username should be at least 3 characters',
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
          onClick={() => toast.info(`Email can't be changed right now. Sorry.`)} //*Email change not implemented. If the user wants to change their email, it will have to sync with firebase auth.
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
          name="willTravelTo"
          label="I can travel to"
          tooltip="We need to know how far you can travel for a gig"
          control={control}
          options={locationOptions}
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

        <Heading label="Promotional" />

        <InputField
          name="stageName"
          label="Stage Name"
          tooltip="This is the name we'll put on promo material"
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
          label="I have followed protocol underground on instagram."
          validation={{
            required: true,
          }}
          toolTip="We want you to follow us so we can raise the profile of our events. This will ultimately help us promote you."
          register={register}
          errors={errors}
        />

        <InputField
          name="facebookName"
          label="Facebook Name"
          tooltip="We need this to verify you've followed us on Facebook"
          validation={{
            required: 'Facebook username is required',
            minLength: {
              value: 5,
              message: 'Username must be at least 5 characters',
            },
            pattern: {
              value: /^[a-zA-Z0-9._]+$/,
              message:
                'Username can only contain alphanumeric characters, periods, and underscores',
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
          label="I have followed protocol underground on facebook."
          validation={{
            required: true,
          }}
          toolTip="We want you to follow us so we can raise the profile of our events. This will ultimately help us promote you."
          register={register}
          errors={errors}
        />

        <button
          type="submit"
          className="primary-button p-1"
          onClick={handleSubmit}
          disabled={buttonLoading}
        >
          {buttonLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </FormProvider>
  );
}
