import React from 'react';

import { HiQuestionMarkCircle } from 'react-icons/hi2';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi2';

export default function Tooltip({ message }) {
  return (
    <div className="group relative flex items-center">
      <div className="text-lg">
        <HiOutlineQuestionMarkCircle />
      </div>
      <div className="absolute hidden group-hover:block w-auto p-2 text-xs text-black rounded-t-md rounded-br-md rounded-bl-sm shadow-md tooltip-text -translate-y-full bg-white">
        {message}
        <div
          className="absolute w-3 h-3 bg-white -bottom-1"
          style={{ transform: 'translateX(-50%) rotate(45deg)' }}
        ></div>
      </div>
    </div>
  );
}
