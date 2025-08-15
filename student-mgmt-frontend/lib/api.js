export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export function getToken() {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem('token') || '';
  } catch {
    return '';
  }
}

export function setToken(t) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', t);
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && options.body) headers.set('Content-Type', 'application/json');

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // token invalid/expired
    clearToken();
    if (typeof window !== 'undefined') window.location.href = '/login';
  }

  return res;
}
