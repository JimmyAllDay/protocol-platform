import React, { useState, useEffect } from 'react';

import Link from 'next/link';

import { FaPlayCircle } from 'react-icons/fa';

export default function AudioFileListItem({
  user,
  mix,
  handleDelete,
  loading,
}) {
  const [fileName, setFileName] = useState(mix.mixName);

  useEffect(() => {
    const updateText = () => {
      try {
        // Ensure mix.name exists and is a string
        if (typeof mix.mixName !== 'string') {
          throw new Error('mix.mixName is not a valid string');
        }

        const screenWidth = window.innerWidth;

        if (screenWidth < 640) {
          // Shorten text for small screens
          setFileName(
            mix.mixName.length > 18
              ? mix.mixName.slice(0, 18) + '...'
              : mix.mixName
          );
        } else if (screenWidth < 1024) {
          // Shorten text for medium screens
          setFileName(
            mix.mixName.length > 35
              ? mix.mixName.slice(0, 35) + '...'
              : mix.mixName
          );
        } else {
          // Full text for large screens
          setFileName(
            mix.mixName.length > 40
              ? mix.mixName.slice(0, 40) + '...'
              : mix.mixName
          );
        }
      } catch (error) {
        console.error('Error updating text:', error);
        // Optionally, you can set a fallback value or handle the error state here
        setFileName('Error displaying title. Woops.');
      }
    };

    // Run the function on load
    updateText();

    // Listen for screen resizing
    window.addEventListener('resize', updateText);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', updateText);
  }, [mix.name]);

  return (
    <div className="flex">
      <div className="audio-file-list-item-container">
        <h2 className="audio-file-list-item-description">{fileName}</h2>
      </div>
      <Link
        href={mix.url}
        className="audio-file-component-button-play"
        target="_blank"
      >
        <div className="text-3xl flex my-auto">
          <FaPlayCircle />
        </div>
      </Link>
      <button
        className="audio-filelist-item-button-delete"
        onClick={() => handleDelete(user.uid, mix.url)}
        disabled={loading}
      >
        Delete
      </button>
    </div>
  );
}
