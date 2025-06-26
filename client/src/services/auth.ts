import {API} from './api';

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    await API.get('/auth/me'); // assumes it checks JWT cookie
    return true;
  } catch {
    return false;
  }
};