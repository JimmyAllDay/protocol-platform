import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FaRegUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from 'context/AuthContext';

export default function UserProfileLink() {
  //TODO: Fix the below when you look at auth solutions
  let { userDetails } = useContext(AuthContext);
  userDetails = userDetails[0];

  const { user, error, isLoading } = useUser();
  const [hover, setHover] = useState(false);

  const handleHoverEnter = () => {
    setHover(true);
  };

  const handleHoverLeave = () => {
    setHover(false);
  };

  if (isLoading) return <div className="my-auto text-sm p-2">Loading...</div>;
  if (error)
    toast.error(
      'There has been an error while logging in. Please log out and try again.' //TODO: Is this an appropriate way to handle errors here?
    );

  const iconStyles = `mx-auto text-2xl text-accent2 bg-accent2 ${
    hover ? 'bg-opacity-50' : 'bg-opacity-30'
  } rounded-xl ms-2`;

  return (
    userDetails?.username && (
      <div className="relative">
        <Link href="/profile">
          <div
            className={`flex ms-4 mt-2`}
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
          >
            <h2 className="hover:text-accent">Hi, {userDetails?.username}</h2>
            <div className={iconStyles}>
              <FaRegUserCircle />
            </div>
          </div>
        </Link>
        {hover && (
          <div
            className="absolute w-[185px] pt-2 left-4"
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
          >
            <div className="border-t border-s border-e border-primary flex flex-col">
              <Link href="/profile" className="hover:text-accent border-b p-1">
                Profile
              </Link>
              <Link href="/uploads" className="hover:text-accent border-b p-1">
                Uploads
              </Link>
              {userDetails.isAdmin && (
                <Link
                  href="/dashboard"
                  className="hover:text-accent border-b p-1"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    )
  );
}
