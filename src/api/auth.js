import { post, get, del } from '@/api';

const authApi = {
  login: async (username, password) => {
    try {
      const response = await post('/auth/login', { username, password });
      const data = response.data;
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      throw new Error('Erro ao fazer login');
    }
  },
  logout: async () => {
    try {
      const response = await get('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao fazer logout');
    }
  },
  getMe: async () => {
    try {
      const response = await get('/auth/me');
      return response;
    } catch (error) {
      throw new Error('Não autenticado');
    }
  },
  createUser: async (data) => {
    try {
      const result = await post('/usuarios', data);
      return result;
    } catch (error) {
      throw error;
    }
  }
};

export default authApi;