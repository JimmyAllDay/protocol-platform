import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

export default function UserDetailsForm() {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isCheckedPromo, setIsCheckedPromo] = useState(false);
  const [instagramHandle, setInstagramHandle] = useState('');
  const [isCheckedInstagram, setIsCheckedInstagram] = useState(false);
  const [facebookName, setFacebookName] = useState('');
  const [isCheckedFacebook, setIsCheckedFacebook] = useState(false);
  const [isCheckedConsent, setIsCheckedConsent] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    console.log('Clicked');

    try {
      const response = await axios.post('/api/userDetails', {
        firstName,
        surname,
        username,
        phoneNumber,
        email,
        isCheckedPromo,
        instagramHandle,
        isCheckedInstagram,
        facebookName,
        isCheckedFacebook,
      });

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    console.log(isCheckedPromo),
    (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 p-4 border"
      >
        <div className="text-3xl flex justify-center">Details</div>
        <div className="flex flex-col justify-items-center">
          <label
            htmlFor="firstName"
            className="flex items-center justify-center"
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="bg-primary border border-white"
            required
          />
        </div>
        <div className="flex flex-col justify-items-center">
          <label htmlFor="surname" className="flex items-center justify-center">
            Surname
          </label>
          <input
            id="surname"
            type="text"
            value={surname}
            onChange={(event) => setSurname(event.target.value)}
            className="bg-primary border border-white"
            required
          />
        </div>
        <div className="flex flex-col justify-items-center">
          <label
            htmlFor="username"
            className="flex items-center justify-center"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="bg-primary border border-white"
            required
          />
        </div>
        <div className="flex flex-col justify-items-center">
          <label
            htmlFor="phoneNumber"
            className="flex items-center justify-center"
          >
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="text"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            className="bg-primary border border-white"
            required
          />
        </div>
        <div className="flex flex-col justify-items-center">
          <label htmlFor="email" className="flex items-center justify-center">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="bg-primary border border-white"
            required
          />
        </div>
        <div className="flex flex-col justify-items-center">
          <label htmlFor="promo" className="text-xs">
            <input
              type="checkbox"
              name="promo"
              checked={isCheckedPromo}
              onChange={(event) => setIsCheckedPromo(event.target.checked)}
              className="accent-black bg-black border border-white"
            />
            I will assist to promote myself and protocol events by distributing
            promo material through my social media channels.
          </label>
        </div>
        {isCheckedPromo && (
          <>
            <div className="text-3xl flex justify-center">Socials</div>
            <div className="flex flex-col justify-items-center">
              <label
                htmlFor="instagramHandle"
                className="flex items-center justify-center"
              >
                Instagram Handle
              </label>
              <input
                id="instagramHandle"
                type="text"
                value={instagramHandle}
                onChange={(event) => setInstagramHandle(event.target.value)}
                className="bg-primary border border-white"
              />
            </div>
            <div className="flex flex-col justify-items-center">
              <label>
                <input
                  type="checkbox"
                  name="instagram"
                  checked={isCheckedInstagram}
                  onChange={(event) =>
                    setIsCheckedInstagram(event.target.checked)
                  }
                  className="accent-black bg-black border border-white"
                />
                I have followed protocol.underground on instagram.
              </label>
            </div>

            <div className="flex flex-col justify-items-center">
              <label
                htmlFor="facebookName"
                className="flex items-center justify-center"
              >
                Facebook Name
              </label>
              <input
                id="facebookName"
                type="text"
                value={facebookName}
                onChange={(event) => setFacebookName(event.target.value)}
                className="accent-black bg-black border border-white"
              />
            </div>
            <div className="flex flex-col justify-items-center">
              <label>
                <input
                  type="checkbox"
                  name="facebook"
                  checked={isCheckedFacebook}
                  onChange={(event) =>
                    setIsCheckedFacebook(event.target.checked)
                  }
                />
                I have followed protocol.underground on facebook.
              </label>
            </div>
          </>
        )}

        <button type="submit" className="primary-button" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    )
  );
}
