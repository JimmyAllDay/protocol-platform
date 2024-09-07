import React from 'react';
import Link from 'next/link';

export default function EventListItem({ event, loading, handleDelete }) {
  return (
    <div key={event._id} className="text-primary dark:text-accentDark flex">
      <Link
        href={`/events/${event.id}`}
        className="w-full flex hover:text-primaryDark border-border dark:border-accentDark border-t border-b border-l rounded-s ps-1 pe-2 py-[1.8px] text-lg"
      >
        <h2>{`${event.title}`}</h2>
        <h2 className="ms-auto">{event.date}</h2>
      </Link>
      <button
        className="border border-border dark:text-accentDark px-1 bg-primaryDark dark:bg-accentDark dark:border-accentDark bg-opacity-20 dark:bg-opacity-20 hover:bg-opacity-30 dark:hover:bg-opacity-30 text-primary rounded-tr rounded-br text-xs"
        onClick={() => handleDelete(event.id, event.imageUrl)}
        disabled={loading}
      >
        Delete
      </button>
    </div>
  );
}
