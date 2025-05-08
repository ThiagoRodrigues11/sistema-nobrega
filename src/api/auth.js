import { post, get, del } from '@api/api.js';

const authApi = {
  login: async (username, password) => {
    try {
      const data = await post('/auth/login', { username, password });
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
      await del('/auth/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
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