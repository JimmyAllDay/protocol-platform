import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [userPreference, setUserPreference] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedUserPreference = localStorage.getItem('user-theme-preference');
    const savedTheme = localStorage.getItem('theme');

    if (savedUserPreference) {
      setUserPreference(savedUserPreference);
      setTheme(savedUserPreference);
    } else if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }

    setIsMounted(true); // Mark as mounted after determining theme

    document.documentElement.classList.toggle('dark', theme === 'dark');

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const systemPrefersDark = mediaQuery.matches;
      if (!userPreference && theme !== (systemPrefersDark ? 'dark' : 'light')) {
        const newTheme = systemPrefersDark ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
    };

    mediaQuery.addListener(handleChange);

    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, [userPreference, isMounted]); // Remove `theme` dependency to prevent loop

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, isMounted]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setUserPreference(newTheme);
    localStorage.setItem('user-theme-preference', newTheme);
  };

  if (!isMounted) return null; // Avoid initial render until mounted

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
