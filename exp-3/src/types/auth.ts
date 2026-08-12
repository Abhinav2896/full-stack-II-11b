export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface JWTPayload {
  sub: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
  iat: number;
  exp: number;
}

export type StorageType = 'localStorage' | 'sessionStorage';

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  getDecodedToken: () => JWTPayload | null;
  getRawToken: () => string | null;
}
