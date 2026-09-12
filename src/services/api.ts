import axios from 'axios';

const DEFAULT_API_URL = 'https://clyvet-api.onrender.com';

export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }
  return DEFAULT_API_URL;
}

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use((response) => {
  const data = response.data;
  if (typeof data === 'string' && data.toLowerCase().includes('<html')) {
    return Promise.reject(
      new Error('A API Java ainda está enviando a página de login. Faça o deploy da versão nova no Render.')
    );
  }
  return response;
});
