import { Capacitor } from '@capacitor/core';
const BACKEND_ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN;
// Log platform for debugging
console.log('🔌 [Config] Platform:', Capacitor.getPlatform());
console.log('📱 [Config] Is Native:', Capacitor.isNativePlatform());

function getBaseUrl(): string {
  // Simple check: If it's a native mobile app, use the full URL.
  // Otherwise (Web, Mobile Web, PWA), use the relative path to go through the Proxy.
  if (Capacitor.isNativePlatform()) {
    console.log('🔗 [Config] Using Native Backend URL');
    return "https://workerconnectbackend.onrender.com/api";
  }

  // Default to Proxy for all web environments (Localhost, Netlify, Custom Domains)
  console.log('🔗 [Config] Using Web Proxy URL path');
  return "/api";
}

// Helper to get correctly routed SAML URL
// export function getSamlLoginUrl(role: 'worker' | 'establishment' | 'department'): string {
//   if (Capacitor.isNativePlatform()) {
//     return `https://workerconnectbackend.onrender.com/saml/login/${role}`;
//   }
//   // Web: Proxied through Netlify/Vite
//   return `/saml/login/${role}`;
// }

export const getSamlLoginUrl = (
  role: 'worker' | 'establishment' | 'department'
) => {
  const isNative = Capacitor.isNativePlatform();
  const isDev = import.meta.env.DEV;

  if (isNative) {
    return `/saml/login/${role}`;
  }

  if (isDev) {
    return `/saml/login/${role}`;
  }

  if (!BACKEND_ORIGIN) {
    console.error('@CKK Missing VITE_BACKEND_ORIGIN');
    return `/saml/login/${role}`; // safe fallback
  }

  return `${BACKEND_ORIGIN}/saml/login/${role}`;
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 10000,
  // Add backend root URL for non-API links (like SAML)
  BACKEND_ROOT: Capacitor.isNativePlatform()
    ? "https://workerconnectbackend.onrender.com"
    : ""
};

export default API_CONFIG;
