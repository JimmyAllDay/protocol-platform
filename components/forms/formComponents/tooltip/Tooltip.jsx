import React from 'react';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi2';
import { Tooltip as ReactTippy } from 'react-tippy';
import 'react-tippy/dist/tippy.css';

export default function Tooltip({ message }) {
  return (
    <ReactTippy title={message} position="top" trigger="mouseenter">
      <div className="text-lg">
        <HiOutlineQuestionMarkCircle />
      </div>
    </ReactTippy>
  );
}
