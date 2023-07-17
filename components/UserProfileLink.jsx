import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FaRegUserCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function Profile() {
  const { user, error, isLoading } = useUser();
  const [hover, setHover] = useState(false);

  const handleHoverEnter = () => {
    setHover(true);
  };

  const handleHoverLeave = () => {
    setHover(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const iconStyles = `mx-auto text-2xl text-accent2 bg-accent2 ${
    hover ? 'bg-opacity-50' : 'bg-opacity-30'
  } rounded-xl ms-2`;

  return (
    user && (
      <div className={`${hover ? 'text-accent' : ''}`}>
        <Link href="/profile">
          <div
            className={`flex ms-4 mt-2`}
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
          >
            <h2>Hi, {user.nickname}</h2>
            <div className={iconStyles}>
              <FaRegUserCircle />
            </div>
          </div>
        </Link>
      </div>
    )
  );
}
