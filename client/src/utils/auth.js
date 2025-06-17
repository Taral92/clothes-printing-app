export const setToken = (token) => {
  if (token && typeof token === 'string' && token.split('.').length === 3) {
    localStorage.setItem('token', token);
  } else {
    console.warn('Invalid token provided to setToken:', token);
  }
};

export const getToken = () => localStorage.getItem('token');

export const logout = () => localStorage.removeItem('token');

export const isAuthenticated = () => !!getToken();