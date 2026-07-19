import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// interface RetryConfig extends InternalAxiosRequestConfig {
//   _retry?: boolean;
// }

// api.interceptors.response.use(
//   (res) => res,
//   async (error: AxiosError) => {
//     const original = error.config as RetryConfig;
//     const isAuthEndpoint =
//       original.url?.includes('/auth/refresh') ||
//       original.url?.includes('/auth/login') ||
//       original.url?.includes('/auth/me');

//     if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
//       original._retry = true;
//       try {
//         await api.post('/auth/refresh');
//         return api(original);
//       } catch {
//         if (
//           typeof window !== 'undefined' &&
//           window.location.pathname !== '/login'
//         ) {
//           window.location.href = '/login';
//         }
//         return Promise.reject(error);
//       }
//     }
//     return Promise.reject(error);
//   },
// );

export default api;
