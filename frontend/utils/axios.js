import Axios from 'axios';
import { env } from './env';
import useAuthStore from './useAuth';

function authRequestInterceptor(config) {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

const apiClient = Axios.create({
  baseURL: env.API_URL,
});

apiClient.interceptors.request.use(authRequestInterceptor);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {  
    if (error.response && error.response.status === 401) {
      // If unauthorized (401), redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// apiClient.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const refreshToken = useAuthStore.getState().refreshToken;
//         const response = await Axios.post(`${env.API_URL}/auth/refresh`, {
//           refresh_token: refreshToken,
//         });

//         const { token, refreshToken: newRefreshToken } = response.data?.data;

//         // Update tokens in the store
//         useAuthStore.getState().setToken(token);
//         useAuthStore.getState().setRefreshToken(newRefreshToken);

//         originalRequest.headers.Authorization = `Bearer ${token}`;
//         return apiClient(originalRequest);
//       } catch (e) {
//         // Clear auth state using store function
//         useAuthStore.getState().removeAuth();
//         window.location.reload()
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export { apiClient };
