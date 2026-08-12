import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { AuthState, User, LoginCredentials, StorageType, JWTPayload, AuthContextValue } from '../types/auth';
import {
  generateToken,
  validateToken,
  decodeToken,
  storeToken,
  retrieveToken,
  removeToken,
} from '../lib/jwt';

type AuthAction =
  | { type: 'AUTH_INIT' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_CLEAR_ERROR' }
  | { type: 'AUTH_REFRESH_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_INIT':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'AUTH_CLEAR_ERROR':
      return { ...state, error: null };
    case 'AUTH_REFRESH_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const payloadToUser = (payload: JWTPayload): User => ({
  id: payload.sub,
  username: payload.username,
  email: payload.email,
  role: payload.role,
  name: payload.name,
});

const credentialsToUser = (credentials: LoginCredentials): User => {
  const username = credentials.username.trim();
  const id = `usr_${btoa(username).replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toLowerCase()}`;
  const role: 'admin' | 'user' = username.toLowerCase() === 'admin' ? 'admin' : 'user';
  return {
    id,
    username,
    email: credentials.email?.trim() || `${username.toLowerCase()}@jwt-demo.local`,
    role,
    name: credentials.name?.trim() || username
      .split(/[._-]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') || username,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      dispatch({ type: 'AUTH_INIT' });

      const storedToken = retrieveToken();

      if (!storedToken) {
        dispatch({ type: 'AUTH_LOGOUT' });
        return;
      }

      const { valid, payload } = await validateToken(storedToken);

      if (valid && payload) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: payloadToUser(payload),
            token: storedToken,
          },
        });
      } else {
        removeToken();
        dispatch({
          type: 'AUTH_FAILURE',
          payload: valid ? 'Session expired. Please log in again.' : 'Invalid session.',
        });
      }
    };

    void initAuth();
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials, rememberMe: boolean = true): Promise<boolean> => {
      dispatch({ type: 'AUTH_INIT' });

      const username = credentials.username.trim();
      const password = credentials.password;

      if (!username || username.length < 3) {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: 'Username must be at least 3 characters',
        });
        return false;
      }

      if (!password || password.length < 6) {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: 'Password must be at least 6 characters',
        });
        return false;
      }

      const user = credentialsToUser(credentials);
      const token = await generateToken(user);

      const storageType: StorageType = rememberMe ? 'localStorage' : 'sessionStorage';
      storeToken(token, storageType);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });

      return true;
    },
    []
  );

  const logout = useCallback((): void => {
    removeToken();
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  const clearError = useCallback((): void => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
  }, []);

  const getDecodedToken = useCallback((): JWTPayload | null => {
    if (!state.token) return null;
    return decodeToken(state.token);
  }, [state.token]);

  const getRawToken = useCallback((): string | null => {
    return state.token;
  }, [state.token]);

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    clearError,
    getDecodedToken,
    getRawToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
