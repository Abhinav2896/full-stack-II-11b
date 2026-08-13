import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  from?: { pathname?: string };
}

interface FormErrors {
  username?: string;
  password?: string;
  name?: string;
  email?: string;
}

export const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'viewer' | 'poster'>('viewer');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});

  const { login, signUp, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const from = state?.from?.pathname ?? '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (isSignUp) {
      if (!name.trim()) {
        newErrors.name = 'Full Name is required';
      } else if (name.trim().length < 3) {
        newErrors.name = 'Full Name must be at least 3 characters';
      }

      const emailRegex = /^[^s@]+@[^s@]+\.[^s@]+$/;
      if (!email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    if (isSignUp) {
      await signUp({
        username: username.trim(),
        password,
        name: name.trim(),
        email: email.trim(),
        role,
      }, rememberMe);
    } else {
      await login({ username: username.trim(), password }, rememberMe);
    }
  };

  const handleToggleMode = () => {
    setIsSignUp((prev) => !prev);
    setErrors({});
    clearError();
  };

  return (
    <div className="bg-hybrid flex items-center justify-center p-6">
      <div className="max-w-md w-full glass-panel p-10 space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-slate-600 text-sm mt-2 font-medium">
            {isSignUp
              ? 'Register custom claims for your JWT'
              : 'Authenticate to access the dashboard'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 text-xs rounded-xl shadow-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {isSignUp && (
            <>
              <div>
                <label htmlFor="name" className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 pl-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  placeholder="John Doe"
                  className={`neo-input w-full px-4 py-3 text-sm text-slate-800 ${
                    errors.name ? 'border-red-300' : ''
                  }`}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-[11px] text-red-600 mt-1.5 pl-1 font-medium">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 pl-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="john@example.com"
                  className={`neo-input w-full px-4 py-3 text-sm text-slate-800 ${
                    errors.email ? 'border-red-300' : ''
                  }`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-600 mt-1.5 pl-1 font-medium">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 pl-1">
                  Choose Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'viewer' | 'poster')}
                  className="neo-input w-full px-4 py-3 text-sm text-slate-800 appearance-none bg-transparent cursor-pointer"
                  disabled={isLoading}
                >
                  <option value="viewer">Viewer (Can only view posts)</option>
                  <option value="poster">Poster (Can add and edit own posts)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label htmlFor="username" className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 pl-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors({ ...errors, username: undefined });
              }}
              placeholder="Min 3 characters"
              className={`neo-input w-full px-4 py-3 text-sm text-slate-800 ${
                errors.username ? 'border-red-300' : ''
              }`}
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-[11px] text-red-600 mt-1.5 pl-1 font-medium">{errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 pl-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              placeholder="Min 6 characters"
              className={`neo-input w-full px-4 py-3 text-sm text-slate-800 ${
                errors.password ? 'border-red-300' : ''
              }`}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-[11px] text-red-600 mt-1.5 pl-1 font-medium">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center pl-1 mt-6 mb-8">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-indigo-500 rounded border-slate-300 focus:ring-indigo-500 bg-white/50 cursor-pointer"
              disabled={isLoading}
            />
            <label htmlFor="remember-me" className="ml-3 block text-[11px] font-semibold text-slate-600 uppercase tracking-wider select-none cursor-pointer">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="neo-button neo-button-primary w-full py-3.5 text-sm uppercase tracking-widest shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={handleToggleMode}
            className="text-[11px] text-indigo-700/80 hover:text-indigo-800 font-bold uppercase tracking-widest transition-colors"
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
