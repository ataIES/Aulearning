import { createContext, useState } from 'react';

export const UIContext = createContext();

export function UIProvider({ children }) {
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const showSuccess = (message, title = 'Correcto') => {
    setAlert({
      show: true,
      type: 'success',
      title,
      message,
    });
  };

  const showError = (message, title = 'Error') => {
    setAlert({
      show: true,
      type: 'danger',
      title,
      message,
    });
  };

  const closeAlert = () => {
    setAlert({
      show: false,
      type: 'success',
      title: '',
      message: '',
    });
  };

  return (
    <UIContext.Provider
      value={{
        loading,
        setLoading,
        alert,
        showSuccess,
        showError,
        closeAlert,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}