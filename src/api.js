// src/api/api.js
import axios from 'axios';

const API_URL = 'https://sistema-nobrega-1.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true,
    mode: 'cors',
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
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Funções de requisição
export const get = async (endpoint, config = {}) => {
    try {
        const response = await api.get(endpoint, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const post = async (endpoint, data, config = {}) => {
    try {
        const response = await api.post(endpoint, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const put = async (endpoint, data, config = {}) => {
    try {
        const response = await api.put(endpoint, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const del = async (endpoint, config = {}) => {
    try {
        const response = await api.delete(endpoint, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};