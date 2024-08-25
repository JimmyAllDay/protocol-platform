// context/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [userPreference, setUserPreference] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedUserPreference = localStorage.getItem('user-theme-preference');

    if (savedUserPreference) {
      setUserPreference(savedUserPreference);
      setTheme(savedUserPreference);
    } else if (savedTheme) {
      setTheme(savedTheme);
    } else {
      adjustThemeBasedOnTime();
    }

    // Set up matchMedia listeners for system preference
    const darkModeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );
    const lightModeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: light)'
    );

    const handleChange = () => {
      if (!userPreference) {
        if (darkModeMediaQuery.matches) {
          setTheme('dark');
        } else if (lightModeMediaQuery.matches) {
          setTheme('light');
        }
      }
    };

    darkModeMediaQuery.addListener(handleChange);
    lightModeMediaQuery.addListener(handleChange);

    // Clean up listeners on component unmount
    return () => {
      darkModeMediaQuery.removeListener(handleChange);
      lightModeMediaQuery.removeListener(handleChange);
    };
  }, [userPreference]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const adjustThemeBasedOnTime = () => {
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 6) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setUserPreference(newTheme);
    localStorage.setItem('user-theme-preference', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
