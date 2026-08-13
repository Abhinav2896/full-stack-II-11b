export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'poster' | 'viewer';
  name: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  email?: string;
  name?: string;
  role?: 'admin' | 'poster' | 'viewer';
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
  role: 'admin' | 'poster' | 'viewer';
  name: string;
  iat: number;
  exp: number;
}

export type StorageType = 'localStorage' | 'sessionStorage';

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials, rememberMe?: boolean) => Promise<boolean>;
  signUp: (credentials: LoginCredentials, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  getDecodedToken: () => JWTPayload | null;
  getRawToken: () => string | null;
}
