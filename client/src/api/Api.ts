 
import { handleApiError } from "../error/errorHandler";
import type { LoginFormInputs } from "../schemas/loginSchema";
import type { RegisterFormInputs } from "../schemas/registerSchema";
import {API} from '../services/api'
import type { ShortUrl } from "../types/urlTypes";


export const registerUser = async (data: RegisterFormInputs) => {
    try {
        const response = await API.post('/auth/register', data)
        return response.data;
    } catch (error) {
        const formatted = handleApiError(error);
        throw new Error(formatted);
    }
}

export const signIn = async(data:LoginFormInputs)=> {
    try {
        const response = await API.post('/auth/login',data)
        return response.data;
    } catch (error) {
        const formatted = handleApiError(error);
        throw new Error(formatted);
    }
}


export const checkAuth = async () => {
  try {
    const res = await API.get('/auth/me');
    return res.data;
  } catch {
    return null;
  }
};

export const logoutUser = async () => {
  const res = await API.post('/auth/logout');
  return res.data;
};

export const createShortUrl = async(originalUrl: string)=> {
    try {
        const res = await API.post('/url/create', { originalUrl });
        return res.data;
    } catch (error) {
        const formatted = handleApiError(error);
        throw new Error(formatted);
    }
}

export const getUserUrls = async (): Promise<ShortUrl[]> => {
    try {       
        const res = await API.get('/url');       
        return res.data;
    } catch (error) {
        const formatted = handleApiError(error);
        throw new Error(formatted);
    }
}

