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
  maxRedirects: 0,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use((response) => {
  const data = response.data;
  if (typeof data === 'string' && data.toLowerCase().includes('<html')) {
    return Promise.reject(
      new Error('A API respondeu com a página de login neste pedido. Tente salvar de novo; não é preciso publicar a Java de novo.')
    );
  }
  return response;
});
