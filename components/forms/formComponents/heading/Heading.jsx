import React from 'react';

export default function Heading({ label }) {
  return (
    <div className="text-2xl flex justify-center">
      <div className="mt-6">{label}</div>
    </div>
  );
}
