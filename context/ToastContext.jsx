import { createContext, useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const [globalToastMessage, setGlobalToastMessage] = useState('');
  console.log(globalToastMessage);

  useEffect(() => {
    if (globalToastMessage !== '') {
      toast(globalToastMessage);
    }
    return () => setGlobalToastMessage('');
  }, [globalToastMessage]);

  <ToastContainer
    position="bottom-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
  />;

  const contextValue = {
    globalToastMessage,
    setGlobalToastMessage,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};

export { ToastProvider, ToastContext };
