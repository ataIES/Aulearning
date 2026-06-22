import { createContext, useState } from 'react';

export const UIContext = createContext();

export function UIProvider({ children }) {
  const [loading, setLoading] = useState(false);

  const [errorModal, setErrorModal] = useState({
    show: false,
    title: '',
    message: '',
  });

  const showError = (message, title = 'Error') => {
    setErrorModal({
      show: true,
      title,
      message,
    });
  };

  const closeError = () => {
    setErrorModal({
      show: false,
      title: '',
      message: '',
    });
  };

  return (
    <UIContext.Provider
      value={{
        loading,
        setLoading,
        errorModal,
        showError,
        closeError,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}