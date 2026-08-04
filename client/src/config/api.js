/**
 * API Configuration Helper
 * In production (Vercel), routes directly to live Render backend if proxy is inactive.
 */
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE = import.meta.env.VITE_API_URL || (isLocal ? '' : 'https://swipehire-backend.onrender.com');

export const getApiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
};
