import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-xl w-full bg-white shadow-sm border border-slate-200 rounded-lg p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-3">
            Experiment 3
          </span>
          <h1 className="text-2xl font-bold text-slate-900">
            JWT Session Authentication
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Stateless Token-Based Authentication & Session Management
          </p>
        </div>

        <hr className="border-slate-100" />

        {/* Aim & Objectives */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
            Experiment Details
          </h2>
          <div className="bg-slate-50 border border-slate-100 rounded-md p-4 space-y-3">
            <div>
              <h3 className="text-xs font-semibold text-slate-700">Aim:</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                To design and implement a secure authentication system using JWT for user login and session management.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-700">Objectives:</h3>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 mt-0.5">
                <li>Understand authentication mechanisms in web applications</li>
                <li>Implement token-based authentication using JWT</li>
                <li>Manage user sessions in a stateless architecture</li>
                <li>Handle token storage and validation securely</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Session Status & Actions */}
        <div className="space-y-4 pt-2">
          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-md p-3 text-xs flex items-center justify-between">
                <div>
                  <p className="font-semibold">Active Session Detected</p>
                  <p className="text-emerald-700 mt-0.5">Signed in as {user?.username} ({user?.role})</p>
                </div>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div className="flex gap-3">
                <Link
                  to="/dashboard"
                  className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm py-2.5 px-4 rounded-md transition-colors shadow-sm"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm py-2.5 px-4 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 text-center">
                No active session found. Navigate to the login form to authenticate.
              </p>
              <Link
                to="/login"
                className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm py-2.5 px-4 rounded-md transition-colors shadow-sm"
              >
                Proceed to Login Page
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

