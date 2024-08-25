import React, { useState } from 'react';
import { useTheme } from 'context/ThemeContext';
import { FaRegMoon } from 'react-icons/fa6';
import { LuSun } from 'react-icons/lu';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <label className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={() => {
              toggleTheme();
            }}
            className="sr-only"
          />
          <div className={`box block h-5 w-9 rounded-full bg-primaryDark`}>
            <div className="flex border border-accent text-primaryDark justify-between items-center w-full h-full p-0.5 rounded-full text-sm">
              <FaRegMoon />
              <div className="text-primaryDark">
                <LuSun />
              </div>
            </div>
          </div>
          <div
            className={`absolute left-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent transition ${
              theme === 'dark' ? 'translate-x-full' : ''
            }`}
          ></div>
        </div>
      </label>
    </>
  );
};

export default ThemeToggle;
