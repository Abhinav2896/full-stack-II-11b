import type { JWTPayload, User, StorageType } from '../types/auth';

const SECRET_KEY = 'experiment-jwt-secret-key-exp3';
const TOKEN_EXPIRY_HOURS = 24;
const TOKEN_STORAGE_KEY = 'exp3_auth_token';

const base64UrlEncode = (input: string): string => {
  const utf8 = new TextEncoder().encode(input);
  let binary = '';
  const len = utf8.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(utf8[i]);
  }
  const base64 = btoa(binary);
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const base64UrlDecode = (input: string): string => {
  try {
    let base64 = input
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) {
      base64 += '='.repeat(4 - pad);
    }
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch {
    throw new Error('Invalid base64 string');
  }
};

const generateHmac = async (message: string, secret: string): Promise<string> => {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const signatureBytes = new Uint8Array(signature);

  let binary = '';
  for (let i = 0; i < signatureBytes.byteLength; i++) {
    binary += String.fromCharCode(signatureBytes[i]);
  }
  const base64 = btoa(binary);
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const generateToken = async (user: User): Promise<string> => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    sub: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    name: user.name,
    iat: now,
    exp: now + TOKEN_EXPIRY_HOURS * 60 * 60,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signature = await generateHmac(signingInput, SECRET_KEY);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payloadPart = parts[1];
    const decoded = base64UrlDecode(payloadPart);
    const payload: JWTPayload = JSON.parse(decoded);

    return payload;
  } catch {
    return null;
  }
};

export const validateToken = async (token: string): Promise<{ valid: boolean; payload: JWTPayload | null }> => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, payload: null };
    }

    const [encodedHeader, encodedPayload, providedSignature] = parts;

    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = await generateHmac(signingInput, SECRET_KEY);

    if (providedSignature !== expectedSignature) {
      return { valid: false, payload: null };
    }

    const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, payload };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, payload: null };
  }
};

export const decodeHeader = (token: string): { alg: string; typ: string } | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const decoded = base64UrlDecode(parts[0]);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const storeToken = (token: string, storageType: StorageType = 'localStorage'): void => {
  try {
    if (storageType === 'localStorage') {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  } catch (e) {
    console.error('Failed to store token:', e);
  }
};

export const retrieveToken = (): string | null => {
  try {
    return (
      localStorage.getItem(TOKEN_STORAGE_KEY) ??
      sessionStorage.getItem(TOKEN_STORAGE_KEY)
    );
  } catch (e) {
    console.error('Failed to retrieve token:', e);
    return null;
  }
};

export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to remove token:', e);
  }
};

export const getTokenExpiryInfo = (token: string): { issuedAt: Date; expiresAt: Date; timeLeft: number } | null => {
  const payload = decodeToken(token);
  if (!payload) return null;

  const issuedAt = new Date(payload.iat * 1000);
  const expiresAt = new Date(payload.exp * 1000);
  const timeLeft = payload.exp * 1000 - Date.now();

  return { issuedAt, expiresAt, timeLeft };
};

export const attachTokenToRequest = (
  headers: Headers = new Headers(),
  token: string | null = retrieveToken()
): Headers => {
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
};

export const createAuthFetch = (
  input: RequestInfo | URL,
  init: RequestInit = {}
): [RequestInfo | URL, RequestInit] => {
  const token = retrieveToken();
  if (token) {
    init.headers = attachTokenToRequest(new Headers(init.headers), token);
  }
  return [input, init];
};
