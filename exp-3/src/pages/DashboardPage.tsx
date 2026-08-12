import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTokenExpiryInfo, decodeHeader } from '../lib/jwt';
import type { JWTPayload } from '../types/auth';

interface TokenInfo {
  header: { alg: string; typ: string } | null;
  payload: JWTPayload | null;
  rawToken: string | null;
  expiry: ReturnType<typeof getTokenExpiryInfo>;
  timeLeftFormatted: string;
}

const formatTimeLeft = (ms: number): string => {
  if (ms <= 0) return 'Expired';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const formatDate = (date: Date): string => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const DashboardPage = () => {
  const { user, logout, getDecodedToken, getRawToken } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'token' | 'claims'>('overview');
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const refreshTokenInfo = useCallback(() => {
    const rawToken = getRawToken();
    const payload = getDecodedToken();
    const header = rawToken ? decodeHeader(rawToken) : null;
    const expiry = rawToken ? getTokenExpiryInfo(rawToken) : null;
    setTokenInfo({
      header,
      payload,
      rawToken,
      expiry,
      timeLeftFormatted: expiry ? formatTimeLeft(expiry.timeLeft) : 'N/A',
    });
  }, [getRawToken, getDecodedToken]);

  useEffect(() => {
    refreshTokenInfo();
    const interval = setInterval(refreshTokenInfo, 1000);
    return () => clearInterval(interval);
  }, [refreshTokenInfo]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '??';

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="glass-card p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/50 to-purple-500/50 flex items-center justify-center border border-white/20 text-white font-bold text-lg">
              {initials}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Welcome back, {user?.name?.split(' ')[0]}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
                <p className="text-white/60 text-sm">
                  {user?.email} •{' '}
                  <span className="glass-badge px-2 py-0.5 text-xs capitalize">{user?.role}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshTokenInfo}
              className="glass-button-secondary py-2 px-4 flex items-center gap-2 text-sm"
              title="Refresh token info"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="glass-button-secondary py-2 px-4 flex items-center gap-2 text-sm !bg-red-500/20 !border-red-500/30 hover:!bg-red-500/30"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="User ID"
            value={user?.id ?? 'N/A'}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
              </svg>
            }
          />
          <StatCard
            label="Auth Method"
            value="JWT (HS256)"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
          />
          <StatCard
            label="Token Status"
            value="Valid"
            valueClassName="text-green-400"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Time Left"
            value={tokenInfo?.timeLeftFormatted ?? 'N/A'}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        <div className="glass-card overflow-hidden">
          <div className="flex border-b border-white/10">
            {(['overview', 'token', 'claims'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-none px-6 py-4 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-indigo-400 bg-white/5'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {tab === 'overview' ? 'Overview' : tab === 'token' ? 'Raw JWT Token' : 'Decoded Claims'}
              </button>
            ))}
          </div>

          <div className="p-5 md:p-6">
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                    Session Information
                  </h3>
                  <div className="glass-card-inner p-4 space-y-3">
                    <InfoRow label="Full Name" value={user?.name ?? 'N/A'} />
                    <InfoRow label="Username" value={user?.username ?? 'N/A'} />
                    <InfoRow label="Email" value={user?.email ?? 'N/A'} />
                    <InfoRow
                      label="Role"
                      value={
                        <span className="glass-badge px-2 py-0.5 text-xs capitalize">
                          {user?.role ?? 'N/A'}
                        </span>
                      }
                    />
                    <InfoRow label="Storage" value="localStorage" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                    Token Lifecycle
                  </h3>
                  <div className="glass-card-inner p-4 space-y-3">
                    <InfoRow
                      label="Issued At"
                      value={tokenInfo?.expiry ? formatDate(tokenInfo.expiry.issuedAt) : 'N/A'}
                    />
                    <InfoRow
                      label="Expires At"
                      value={tokenInfo?.expiry ? formatDate(tokenInfo.expiry.expiresAt) : 'N/A'}
                    />
                    <InfoRow
                      label="Remaining"
                      value={<span className="text-indigo-300 font-medium">{tokenInfo?.timeLeftFormatted ?? 'N/A'}</span>}
                    />
                    <InfoRow label="Algorithm" value={tokenInfo?.header?.alg ?? 'HS256'} />
                    <InfoRow label="Token Type" value={tokenInfo?.header?.typ ?? 'JWT'} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'token' && tokenInfo?.rawToken && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                    Encoded JWT (Header.Payload.Signature)
                  </h3>
                  <button
                    onClick={() => copyToClipboard(tokenInfo.rawToken!, 'raw')}
                    className="glass-button-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
                  >
                    {copiedSection === 'raw' ? (
                      <>
                        <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Token
                      </>
                    )}
                  </button>
                </div>

                <div className="glass-card-inner p-4">
                  <p className="font-mono text-xs md:text-sm break-all leading-relaxed">
                    {(() => {
                      const parts = tokenInfo.rawToken!.split('.');
                      return (
                        <>
                          <span className="text-purple-300" title="Header">{parts[0]}</span>
                          <span className="text-white/60">.</span>
                          <span className="text-indigo-300" title="Payload">{parts[1]}</span>
                          <span className="text-white/60">.</span>
                          <span className="text-pink-300" title="Signature">{parts[2]}</span>
                        </>
                      );
                    })()}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <JwtPartBadge label="Header" color="purple" />
                  <JwtPartBadge label="Payload" color="indigo" />
                  <JwtPartBadge label="Signature" color="pink" />
                </div>
              </div>
            )}

            {activeTab === 'claims' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                        Header (JOSE)
                      </h3>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(tokenInfo?.header, null, 2), 'header')}
                        className="glass-button-secondary py-1 px-2.5 text-xs"
                      >
                        {copiedSection === 'header' ? '✓' : 'Copy'}
                      </button>
                    </div>
                    <div className="glass-card-inner p-4">
                      <pre className="font-mono text-xs text-purple-300 whitespace-pre-wrap break-all">
                        {JSON.stringify(tokenInfo?.header ?? {}, null, 2)}
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                        Payload (Claims)
                      </h3>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(tokenInfo?.payload, null, 2), 'payload')}
                        className="glass-button-secondary py-1 px-2.5 text-xs"
                      >
                        {copiedSection === 'payload' ? '✓' : 'Copy'}
                      </button>
                    </div>
                    <div className="glass-card-inner p-4">
                      <pre className="font-mono text-xs text-indigo-300 whitespace-pre-wrap break-all">
                        {JSON.stringify(tokenInfo?.payload ?? {}, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                    Claim Definitions
                  </h3>
                  <div className="glass-card-inner divide-y divide-white/5">
                    <ClaimRow name="sub" description="Subject - Unique user identifier" value={tokenInfo?.payload?.sub} />
                    <ClaimRow name="username" description="Custom - User login name" value={tokenInfo?.payload?.username} />
                    <ClaimRow name="email" description="Custom - User email address" value={tokenInfo?.payload?.email} />
                    <ClaimRow name="role" description="Custom - User role (admin/user)" value={tokenInfo?.payload?.role} />
                    <ClaimRow name="name" description="Custom - Full display name" value={tokenInfo?.payload?.name} />
                    <ClaimRow
                      name="iat"
                      description="Issued At - Unix timestamp when token was created"
                      value={tokenInfo?.payload?.iat?.toString()}
                    />
                    <ClaimRow
                      name="exp"
                      description="Expiration - Unix timestamp when token expires"
                      value={tokenInfo?.payload?.exp?.toString()}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center py-4">
          <p className="text-white/30 text-xs">
            Experiment 1.3.1 • JWT Stateless Authentication • Secure Token Management
          </p>
        </footer>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  icon,
  valueClassName = 'text-white',
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  valueClassName?: string;
}) => (
  <div className="glass-card p-4 animate-slide-up">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-9 h-9 rounded-lg bg-indigo-500/25 flex items-center justify-center text-indigo-300">
        {icon}
      </div>
      <span className="text-white/50 text-xs font-medium uppercase tracking-wide">{label}</span>
    </div>
    <p className={`font-semibold text-lg truncate ${valueClassName}`} title={value}>
      {value}
    </p>
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between py-1.5">
    <span className="text-white/50 text-sm">{label}</span>
    <span className="text-white text-sm font-medium">{value}</span>
  </div>
);

const ClaimRow = ({ name, description, value }: { name: string; description: string; value?: string }) => (
  <div className="py-3 px-2 grid grid-cols-1 md:grid-cols-3 gap-2">
    <code className="text-indigo-300 text-xs font-mono font-semibold">{name}</code>
    <p className="text-white/50 text-xs md:col-span-1">{description}</p>
    <p className="text-white/80 text-xs truncate" title={value}>
      {value ?? '—'}
    </p>
  </div>
);

const JwtPartBadge = ({ label, color }: { label: string; color: 'purple' | 'indigo' | 'pink' }) => {
  const colorMap = {
    purple: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
    indigo: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300',
    pink: 'bg-pink-500/20 border-pink-500/40 text-pink-300',
  };
  return (
    <div className={`p-3 rounded-lg border text-center font-mono text-xs ${colorMap[color]}`}>
      {label}
    </div>
  );
};
