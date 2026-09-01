import { createContext, useEffect, useState } from 'react';

import AuthService from '../services/AuthService';
import {
  clearAuth,
  getToken,
  getUser,
  saveAuth,
} from '../utils/storage';

import { useUI } from '../hooks/useUI';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());
  const [checkingAuth, setCheckingAuth] = useState(true);

  const { setLoading } = useUI();

  const login = async (credentials, remember = false) => {
    const response = await AuthService.login(credentials);

    const user = response.data.user;
    const token = response.data.token;

    saveAuth(token, user, remember);

    setUser(user);
    setToken(token);

    return user;
  };

  const logout = async () => {
    try {
      setLoading(true);

      await AuthService.logout();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error al cerrar sesión:', error);
      }
    } finally {
      clearAuth();

      setUser(null);
      setToken(null);

      setLoading(false);

      window.location.replace('/login');
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();

      if (!storedToken) {
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await AuthService.me();

        const currentUser =
          response?.data?.user ??
          response?.data ??
          response;

        setUser(currentUser);
        setToken(storedToken);
      } catch {
        clearAuth();

        setUser(null);
        setToken(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        checkingAuth,
        isAuthenticated: Boolean(token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}