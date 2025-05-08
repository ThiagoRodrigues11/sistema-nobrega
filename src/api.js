// src/api/api.js
import axios from 'axios';
import config from './config';
import logger from './utils/logger';

logger.info('API', `API URL configurada para: ${config.apiUrl}`);

const api = axios.create({
    baseURL: config.apiUrl,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': '*'
    },
    withCredentials: config.cors.credentials,
    timeout: config.timeouts.apiRequest,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
});

// Interceptador para adicionar token nas requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem(config.auth.tokenStorageKey);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    logger.debug('API', `Requisição ${config.method?.toUpperCase()} para ${config.url}`, config);
    return config;
}, (error) => {
    logger.error('API', 'Erro no interceptador de requisição', error);
    return Promise.reject(error);
});

// Interceptador para tratar respostas
api.interceptors.response.use(
    (response) => {
        logger.debug('API', `Resposta de ${response.config.url}: ${response.status}`);
        return response;
    },
    (error) => {
        if (error.response) {
            // Resposta do servidor com erro
            logger.error('API', 'Erro na resposta da API', {
                url: error.config?.url,
                status: error.response.status,
                data: error.response.data
            });
            
            // Tratamento de erro de autorização
            if (error.response.status === 401 || error.response.status === 403) {
                logger.warn('API', 'Erro de autorização, redirecionando para login');
                localStorage.removeItem(config.auth.tokenStorageKey);
                localStorage.removeItem(config.auth.userStorageKey);
                // Apenas redireciona se não estiver na página de login
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        } else if (error.request) {
            // Requisição foi feita mas não houve resposta (CORS, rede, etc)
            logger.error('API', 'Erro de conexão com o servidor (possível problema de CORS)', error.request);
        } else {
            // Erro na configuração da requisição
            logger.error('API', 'Erro na configuração da requisição', error.message);
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
        logger.apiError('API', endpoint, error);
        throw error;
    }
};

export const post = async (endpoint, data, config = {}) => {
    try {
        const response = await api.post(endpoint, data, config);
        return response.data;
    } catch (error) {
        logger.apiError('API', endpoint, error);
        throw error;
    }
};

export const put = async (endpoint, data, config = {}) => {
    try {
        const response = await api.put(endpoint, data, config);
        return response.data;
    } catch (error) {
        logger.apiError('API', endpoint, error);
        throw error;
    }
};

export const del = async (endpoint, config = {}) => {
    try {
        const response = await api.delete(endpoint, config);
        return response.data;
    } catch (error) {
        logger.apiError('API', endpoint, error);
        throw error;
    }
};