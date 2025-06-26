import {API} from './api';

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    await API.get('/auth/me');  
    return true;
  } catch {
    return false;
  }
};