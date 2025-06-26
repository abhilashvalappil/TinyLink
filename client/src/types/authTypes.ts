export interface User {
  _id?: string;
  username: string;
  email: string;
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated:boolean;
    successMessage: string | null;
}