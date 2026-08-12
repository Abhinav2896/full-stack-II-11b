import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { decodeHeader } from '../lib/jwt';
import type { JWTPayload } from '../types/auth';

interface TokenState {
  raw: string | null;
  header: { alg: string; typ: string } | null;
  payload: JWTPayload | null;
}

export const DashboardPage = () => {
  const { user, logout, getDecodedToken, getRawToken } = useAuth();
  const navigate = useNavigate();
  const [tokenState, setTokenState] = useState<TokenState>({
    raw: null,
    header: null,
    payload: null,
  });

  useEffect(() => {
    const raw = getRawToken();
    const payload = getDecodedToken();
    const header = raw ? decodeHeader(raw) : null;
    setTokenState({ raw, header, payload });
  }, [getRawToken, getDecodedToken]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const tokenParts = tokenState.raw ? tokenState.raw.split('.') : [];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Logged in as <span className="font-semibold text-slate-800">{user?.name}</span> ({user?.email})
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-semibold text-xs py-2 px-4 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* User Details & Overview */}
          <div className="md:col-span-1 bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Session Profile
            </h2>
            <hr className="border-slate-100" />
            <div className="space-y-2.5 text-xs text-slate-600">
              <div>
                <span className="font-semibold block text-slate-400 uppercase tracking-wide">User ID</span>
                <span className="text-slate-900 font-mono break-all">{user?.id}</span>
              </div>
              <div>
                <span className="font-semibold block text-slate-400 uppercase tracking-wide">Username</span>
                <span className="text-slate-900 font-semibold">{user?.username}</span>
              </div>
              <div>
                <span className="font-semibold block text-slate-400 uppercase tracking-wide">Role Claim</span>
                <span className="inline-block bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded capitalize">
                  {user?.role}
                </span>
              </div>
              <div>
                <span className="font-semibold block text-slate-400 uppercase tracking-wide">Storage Type</span>
                <span className="text-slate-900">Browser local/session storage (stateless)</span>
              </div>
            </div>
          </div>

          {/* Raw Encoded JWT Token */}
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              1. Raw JWT Token
            </h2>
            <hr className="border-slate-100" />
            <p className="text-xs text-slate-500">
              Below is the raw JSON Web Token currently stored in the client session. It consists of three parts concatenated by dots:
            </p>
            <div className="bg-slate-900 text-slate-200 font-mono text-xs p-4 rounded-md break-all leading-relaxed select-all">
              {tokenParts.length === 3 ? (
                <>
                  <span className="text-purple-400" title="Header (JOSE Algorithm Details)">{tokenParts[0]}</span>
                  <span className="text-slate-500">.</span>
                  <span className="text-cyan-400" title="Payload (User Claims & Payload)">{tokenParts[1]}</span>
                  <span className="text-slate-500">.</span>
                  <span className="text-rose-400" title="Signature (Secret Signed HMAC Verification)">{tokenParts[2]}</span>
                </>
              ) : (
                <span className="text-slate-400">No token active</span>
              )}
            </div>
            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 text-[10px] text-center font-semibold">
              <span className="bg-purple-50 text-purple-700 border border-purple-200 py-1 rounded">
                Header
              </span>
              <span className="bg-cyan-50 text-cyan-700 border border-cyan-200 py-1 rounded">
                Payload
              </span>
              <span className="bg-rose-50 text-rose-700 border border-rose-200 py-1 rounded">
                Signature
              </span>
            </div>
          </div>
        </div>

        {/* Decoded Claims & Procedure Integrity */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* JWT Header + Payload JSON */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              2. Decoded JWT Claims
            </h2>
            <hr className="border-slate-100" />
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Header Claims (alg/typ)
                </h3>
                <pre className="bg-slate-50 border border-slate-100 p-3 rounded-md text-[11px] font-mono text-purple-700 overflow-x-auto">
                  {JSON.stringify(tokenState.header, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Payload Claims
                </h3>
                <pre className="bg-slate-50 border border-slate-100 p-3 rounded-md text-[11px] font-mono text-cyan-700 overflow-x-auto">
                  {JSON.stringify(tokenState.payload, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Procedure Verification checklist */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              3. Flow Verification Checklist
            </h2>
            <hr className="border-slate-100" />
            <p className="text-xs text-slate-500">
              The 6-step stateless authentication lifecycle verified in this dashboard:
            </p>
            <ul className="text-xs text-slate-700 space-y-3">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <div>
                  <span className="font-semibold block">Step 1 & 2: Login UI & Credentials</span>
                  <span className="text-slate-500 text-[11px]">Username length verified client-side, authenticating session.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <div>
                  <span className="font-semibold block">Step 3 & 4: Simulate JWT & Client Storage</span>
                  <span className="text-slate-500 text-[11px]">HMAC SHA-256 tokens are generated and stored in local/session storage.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <div>
                  <span className="font-semibold block">Step 5 & 6: Header Attachment & Decode</span>
                  <span className="text-slate-500 text-[11px]">Token attached to simulated Authorization request headers. Extracted claims parsed to render this page.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <footer className="text-center pt-4">
          <p className="text-slate-400 text-[10px]">
            Experiment 3 • Secure Session Management with JSON Web Tokens
          </p>
        </footer>
      </div>
    </div>
  );
};

