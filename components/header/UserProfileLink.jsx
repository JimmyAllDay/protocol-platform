import React, { useContext, useState } from 'react';
import Link from 'next/link';

import { FaRegUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

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

  const iconStyles = `mx-auto text-2xl text-accent2 bg-accent2 ${
    hover ? 'bg-opacity-50' : 'bg-opacity-30'
  } rounded-xl ms-2`;

  return (
    user?.email && (
      <div className="relative flex flex-col">
        <Link href="/user/profile" className="my-auto mx-4">
          <div
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
            className="flex"
          >
            <h2 className="hover:text-accent">
              Hi,{' '}
              {user.displayName ||
                user?.email.substring(0, user?.email.indexOf('@')) ||
                'user'}
            </h2>
            <div className={iconStyles}>
              <FaRegUserCircle />
            </div>
          </div>
        </Link>
        {hover && (
          <div
            className="absolute w-[185px] pt-2 top-8 left-4"
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
          >
            <div className="border-t border-s border-e border-primary flex flex-col">
              <Link
                href="/user/profile"
                className="hover:text-accent border-b p-1"
              >
                Profile
              </Link>
              <Link
                href="/user/uploads"
                className="hover:text-accent border-b p-1"
              >
                Uploads
              </Link>
              {user.isAdmin && (
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
