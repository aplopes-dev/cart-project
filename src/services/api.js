import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log(`Interceptor de requisição para ${config.url}`);

  if (token) {
    console.log('Token encontrado, adicionando ao header Authorization');
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('Token não encontrado no localStorage!');
  }

  return config;
}, (error) => {
  console.error('Erro no interceptor de requisição:', error);
  return Promise.reject(error);
});

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => {
    console.log(`Resposta recebida de ${response.config.url}:`, {
      status: response.status,
      statusText: response.statusText
    });
    return response;
  },
  (error) => {
    console.error('Erro na resposta da API:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api;
