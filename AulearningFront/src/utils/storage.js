const TOKEN_KEY = 'aulearning_token';
const USER_KEY = 'aulearning_user';

export function saveAuth(token, user, remember = false) {
  clearAuth();

  const storage = remember ? localStorage : sessionStorage;

  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const user =
    localStorage.getItem(USER_KEY) ||
    sessionStorage.getItem(USER_KEY);

  return user ? JSON.parse(user) : null;
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}