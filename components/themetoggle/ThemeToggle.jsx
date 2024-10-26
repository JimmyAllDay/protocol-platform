import React, { useState } from 'react';
import { useTheme } from 'context/ThemeContext';
import { FaRegMoon } from 'react-icons/fa6';
import { LuSun } from 'react-icons/lu';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="text-lg transition-transform duration-200 ease-in-out border p-[2px] rounded"
    >
      {theme === 'dark' ? <LuSun /> : <FaRegMoon />}
    </button>
  );
};

export default ThemeToggle;
