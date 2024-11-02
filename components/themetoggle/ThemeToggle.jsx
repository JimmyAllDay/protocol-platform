import React, { useState } from 'react';
import { useTheme } from 'context/ThemeContext';
import { FaRegMoon } from 'react-icons/fa6';
import { LuSun } from 'react-icons/lu';

const ThemeToggle = ({ label }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex">
      {label && <p className="me-4 text-sm">Dark mode: </p>}
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        className="text-lg transition-transform duration-200 ease-in-out"
      >
        {theme === 'dark' ? <LuSun /> : <FaRegMoon />}
      </button>
    </div>
  );
};

export default ThemeToggle;
