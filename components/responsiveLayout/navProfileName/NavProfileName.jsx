import React, { useContext, useState } from 'react';
import Link from 'next/link';

import { FaRegUserCircle } from 'react-icons/fa';

import { AuthContext } from 'context/AuthContext';
import { LoadingContext } from 'context/LoadingContext';

export default function NavProfileName() {
  const { user } = useContext(AuthContext);
  const { loading } = useContext(LoadingContext);

  if (loading) return <div className="my-auto text-sm p-2">Loading...</div>;

  return (
    user && (
      <div className="relative flex flex-col border-spacing-1">
        <div className="flex">
          <div className="text-2xl text-background dark:text-accent2Dark me-2 flex items-center">
            <FaRegUserCircle />
          </div>
          <h2 className="text-primaryDark">
            Hi,{' '}
            {user.displayName ||
              user?.email.substring(0, user?.email.indexOf('@')) ||
              'user'}
          </h2>
        </div>
      </div>
    )
  );
}
