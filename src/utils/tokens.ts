import { deleteCookie, setCookie } from './cookie';

export const saveTokens = (refreshToken: string, accessToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const removeTokens = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};
