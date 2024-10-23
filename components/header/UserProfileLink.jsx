import React, { useContext, useState } from 'react';
import Link from 'next/link';

import { FaRegUserCircle } from 'react-icons/fa';

import { AuthContext } from 'context/AuthContext';
import { LoadingContext } from 'context/LoadingContext';

export default function UserLink() {
  const [hover, setHover] = useState(false);

  const { user } = useContext(AuthContext);
  const { loading } = useContext(LoadingContext);

  const handleHoverEnter = () => {
    setHover(true);
  };

  const handleHoverLeave = () => {
    setHover(false);
  };

  if (loading) return <div className="my-auto text-sm p-2">Loading...</div>;

  const iconStyles = `mx-auto text-2xl text-primary dark:text-accentDark dark:bg-accentDark bg-black ${
    hover
      ? 'bg-opacity-50 dark:bg-opacity-50'
      : 'bg-opacity-30 dark:bg-opacity-30'
  } rounded-xl ms-2`;

  return (
    user && (
      <div className="relative flex flex-col">
        <Link href="/user/profile" className="my-auto mx-4">
          <div
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
            className="flex"
          >
            <h2 className="link">
              Hi,{' '}
              {user.displayName ||
                user?.email?.substring(0, user?.email?.indexOf('@')) ||
                'user'}
            </h2>
            <div className={iconStyles}>
              <FaRegUserCircle />
            </div>
          </div>
        </Link>
        {hover && (
          <div
            className="absolute w-[180px] top-7 right-4 dark:text-primaryDark dark:hover:text-accentDark bg-primary dark:bg-primaryDark"
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
          >
            <div className="border-t border-s border-e border dark:border-borderDark border-border flex flex-col">
              <Link
                href="/user/profile"
                className="link border-b border-black dark:border-b-white p-1"
              >
                Profile
              </Link>
              <Link
                href="/user/uploads"
                className="link border-b border-black dark:border-b-white p-1"
              >
                Uploads
              </Link>
              <Link href="/user/account" className="link p-1">
                Account
              </Link>
            </div>
          </div>
        )}
      </div>
    )
  );
}
