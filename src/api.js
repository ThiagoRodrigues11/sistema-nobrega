// src/api/api.js
import axios from 'axios';

// Determina a URL da API com base no ambiente
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

const API_URL = isLocalhost 
    ? 'http://localhost:5000/api'
    : 'https://sistema-nobrega-1.onrender.com/api';

console.log('API URL configurada para:', API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': '*'
    },
    withCredentials: true,
    timeout: 30000,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
});

// Interceptador para adicionar token nas requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`Requisição ${config.method?.toUpperCase()} para ${config.url}`, config);
    return config;
}, (error) => {
    console.error('Erro no interceptador de requisição:', error);
    return Promise.reject(error);
});

// Interceptador para tratar respostas
api.interceptors.response.use(
    (response) => {
        console.log(`Resposta de ${response.config.url}:`, response.status);
        return response;
    },
    (error) => {
        if (error.response) {
            // Resposta do servidor com erro
            console.error('Erro na resposta da API:', {
                url: error.config?.url,
                status: error.response.status,
                data: error.response.data
            });
            
            // Tratamento de erro de autorização
            if (error.response.status === 401 || error.response.status === 403) {
                console.warn('Erro de autorização, redirecionando para login');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Apenas redireciona se não estiver na página de login
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        } else if (error.request) {
            // Requisição foi feita mas não houve resposta (CORS, rede, etc)
            console.error('Erro de conexão com o servidor (possível problema de CORS):', error.request);
        } else {
            // Erro na configuração da requisição
            console.error('Erro na configuração da requisição:', error.message);
        }
        return Promise.reject(error);
    }
);

// Funções de requisição
export const get = async (endpoint, config = {}) => {
    try {
        const response = await api.get(endpoint, config);
        return response.data;
    } catch (error) {
        console.error(`Erro na requisição GET para ${endpoint}:`, error);
        throw error;
    }
};

export const post = async (endpoint, data, config = {}) => {
    try {
        const response = await api.post(endpoint, data, config);
        return response.data;
    } catch (error) {
        console.error(`Erro na requisição POST para ${endpoint}:`, error);
        throw error;
    }
};

export const put = async (endpoint, data, config = {}) => {
    try {
        const response = await api.put(endpoint, data, config);
        return response.data;
    } catch (error) {
        console.error(`Erro na requisição PUT para ${endpoint}:`, error);
        throw error;
    }
};

export const del = async (endpoint, config = {}) => {
    try {
        const response = await api.delete(endpoint, config);
        return response.data;
    } catch (error) {
        console.error(`Erro na requisição DELETE para ${endpoint}:`, error);
        throw error;
    }
};