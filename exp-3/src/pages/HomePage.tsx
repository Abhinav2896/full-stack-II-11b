import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="max-w-4xl w-full space-y-10">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 glass-badge px-4 py-1.5 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Experiment 1.3.1 • JWT Authentication Lab
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="text-gradient">Secure Authentication</span>
            <br />
            <span className="text-white/90">with JSON Web Tokens</span>
          </h1>

          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Implement stateless, token-based session management using digitally signed JWTs.
            Explore the complete flow from credential validation to secure request signing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="glass-button py-3 px-6 inline-flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Go to Dashboard
                </Link>
                <div className="text-white/60 text-sm">
                  Signed in as{' '}
                  <span className="text-white font-medium">{user?.username}</span>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="glass-button py-3 px-6 inline-flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Launch Demo
                </Link>
                <div className="text-white/40 text-sm">Any username + password • No backend required</div>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className="glass-card p-6 hover:scale-[1.02] transition-transform animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-500/30 flex items-center justify-center text-indigo-300 mb-4 border border-white/10">
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-purple-500/30 flex items-center justify-center text-purple-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg">Experiment Flow Achieved</h3>
          </div>
          <ol className="relative border-l border-white/10 space-y-5 ml-2 md:ml-4">
            {FLOW.map((step, i) => (
              <li key={step.label} className="ml-6 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <span className="absolute -left-[13px] md:-left-[17px] flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs md:text-sm font-bold border-2 border-[#16213e]">
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <p className="text-white font-medium text-sm md:text-base">{step.label}</p>
                  <p className="text-white/50 text-xs md:text-sm mt-0.5">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

const FEATURES = [
  {
    title: 'Stateless Tokens',
    description: 'No server-side session store. Each request carries the complete user identity embedded in a signed JWT.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'HS256 Signature',
    description: 'HMAC SHA-256 signature generated via Web Crypto API to validate token integrity and authenticity.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: 'Secure Storage',
    description: 'Persistent localStorage (remember me) or in-memory sessionStorage for flexible session duration.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
  },
];

const FLOW = [
  { label: 'Login form submission', description: 'User enters credentials with client-side validation feedback.' },
  { label: 'Credential validation', description: 'Client-side input validation for username length and password strength.' },
  { label: 'JWT token generation', description: 'HS256-signed token bundles header, claims, and HMAC signature via Web Crypto.' },
  { label: 'Token persisted in browser', description: 'Token stored in localStorage / sessionStorage per user preference.' },
  { label: 'Authorization header attachment', description: `Bearer token attached via "Authorization" header on every request.` },
  { label: 'Token decode + claims display', description: 'Dashboard decodes payload and visualizes registered + custom claims.' },
];
