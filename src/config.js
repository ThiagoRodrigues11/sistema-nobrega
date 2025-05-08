/**
 * Configurações centralizadas da aplicação
 * Este arquivo centraliza todas as configurações que variam por ambiente
 */

// Detectar ambiente
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';
const isDevelopment = process.env.NODE_ENV === 'development' || isLocalhost;
const isProduction = process.env.NODE_ENV === 'production' && !isLocalhost;

// URLs de API por ambiente
const API_URLS = {
  development: 'http://localhost:5000/api',
  production: 'https://sistema-nobrega-1.onrender.com/api'
};

// Configurações CORS por ambiente
const CORS_CONFIG = {
  development: {
    allowedOrigins: ['http://localhost:3000'],
    credentials: true
  },
  production: {
    allowedOrigins: ['https://vestalize.com', 'http://vestalize.com', '*'],
    credentials: true
  }
};

// Configuração atual baseada no ambiente
const config = {
  isLocalhost,
  isDevelopment,
  isProduction,
  env: isDevelopment ? 'development' : 'production',
  apiUrl: isDevelopment ? API_URLS.development : API_URLS.production,
  cors: isDevelopment ? CORS_CONFIG.development : CORS_CONFIG.production,
  
  // Outras configurações do sistema
  auth: {
    tokenStorageKey: 'token',
    userStorageKey: 'user',
    sessionDuration: 24 * 60 * 60 * 1000 // 24 horas em ms
  },
  
  // Timeouts e limites
  timeouts: {
    apiRequest: 30000, // 30 segundos
    longOperation: 120000 // 2 minutos
  }
};

export default config; 