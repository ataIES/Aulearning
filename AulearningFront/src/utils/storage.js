const TOKEN_KEY = 'aulearning_token';
const USER_KEY = 'aulearning_user';

export const saveAuth = (token, user, remember = false) => {
  clearAuth();

  const storage = remember ? localStorage : sessionStorage;

  if (token) {
    storage.setItem(TOKEN_KEY, token);
  }

  if (user) {
    storage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getToken = () => {
  return (
    localStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem(TOKEN_KEY) ||
    null
  );
};

export const getUser = () => {
  const value =
    localStorage.getItem(USER_KEY) ||
    sessionStorage.getItem(USER_KEY);

  if (!value || value === 'undefined' || value === 'null') {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);

    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};