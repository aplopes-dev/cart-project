import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    console.log('Token encontrado, adicionando ao header Authorization');
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('Token não encontrado no localStorage!');
  }


  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
