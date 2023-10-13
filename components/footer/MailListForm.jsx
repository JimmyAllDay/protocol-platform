import { useEffect } from 'react';
import axios from 'axios';
import { getError } from 'utils/error';
import { ToastContainer, toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

export default function SubscribeToMailingList() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ email }) => {
    try {
      await axios
        .post('/api/mailinglist', {
          email,
        })
        .then((result) => {
          toast.success(result.data.message);
        })
        .catch((err) => {
          toast.error(getError(err));
        });
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    //TODO: reset form handler
  }, []);

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col w-full ps-2 pe-8 space-y-4"
    >
      <p>Join the Protocol mailing list for updates</p>
      <input
        type="email"
        {...register('email', {
          required: 'Please enter email',
          pattern: {
            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
            message: 'Please enter valid email',
          },
        })}
        placeholder="protocol@underground.com"
        className="input-field bg-primary border-b border-primary p-0 text-lg tracking-wider"
        id="email"
      ></input>
      <button className="secondary-button p-1">Subscribe</button>
      {errors.email && (
        <div className="text-red-500">{errors.email.message}</div>
      )}
    </form>
  );
}
