import { createContext, useEffect, useState } from 'react';
import AuthService from '../services/AuthService';
import { clearAuth, getToken, getUser, saveAuth } from '../utils/storage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());
  const [checkingAuth, setCheckingAuth] = useState(true);

  const login = async (credentials, remember = false) => {
    const response = await AuthService.login(credentials);
    const authData = response.data;

    saveAuth(authData.token, authData.user, remember);

    setUser(authData.user);
    setToken(authData.token);

    return authData.user;
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch {
      //
    } finally {
      clearAuth();
      setUser(null);
      setToken(null);
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

        setUser(response.data);
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