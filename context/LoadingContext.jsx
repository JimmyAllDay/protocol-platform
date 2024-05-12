import { createContext, useState, useCallback } from 'react';

const LoadingContext = createContext();

const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const handleLoading = useCallback((isLoading) => {
    setLoading(isLoading);
  }, []);

  const contextValue = {
    handleLoading,
    loading,
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
};

export { LoadingProvider, LoadingContext };
