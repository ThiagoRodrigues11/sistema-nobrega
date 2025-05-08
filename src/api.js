// src/api/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Exportar funções específicas
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