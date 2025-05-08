/**
 * Logger estruturado para facilitar a depuração
 * Centraliza e padroniza os logs da aplicação
 */
import config from '../config';

// Níveis de log
const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

// Habilitar/desabilitar logs por nível dependendo do ambiente
const ENABLED_LEVELS = {
  development: [LOG_LEVELS.DEBUG, LOG_LEVELS.INFO, LOG_LEVELS.WARN, LOG_LEVELS.ERROR],
  production: [LOG_LEVELS.WARN, LOG_LEVELS.ERROR]
};

// Cores para console (apenas em desenvolvimento)
const COLORS = {
  [LOG_LEVELS.DEBUG]: '#6c757d', // cinza
  [LOG_LEVELS.INFO]: '#17a2b8',  // azul
  [LOG_LEVELS.WARN]: '#ffc107',  // amarelo
  [LOG_LEVELS.ERROR]: '#dc3545', // vermelho
};

/**
 * Formata a mensagem de log
 * @param {string} level - Nível do log
 * @param {string} module - Módulo/componente da aplicação
 * @param {string} message - Mensagem principal
 * @param {object} data - Dados adicionais
 * @returns {object} - Objeto de log formatado
 */
const formatLogMessage = (level, module, message, data) => {
  const timestamp = new Date().toISOString();
  return {
    timestamp,
    level,
    module,
    message,
    data,
    environment: config.env
  };
};

/**
 * Envia o log para o destino apropriado (console, serviço, etc)
 * @param {object} logObject - Objeto de log formatado
 * @param {string} level - Nível do log
 */
const sendLog = (logObject, level) => {
  // Verifica se o nível de log está habilitado para o ambiente atual
  if (!ENABLED_LEVELS[config.env].includes(level)) {
    return;
  }

  // Em produção, poderia enviar para um serviço de log
  if (config.isProduction) {
    // Implementação de envio para serviço de logs em produção
    // Ex: LogService.send(logObject);
    console[level](JSON.stringify(logObject));
  } else {
    // Em desenvolvimento, formata colorido no console
    const color = COLORS[level] || '#000000';
    console[level](
      `%c[${logObject.timestamp}] [${level.toUpperCase()}] [${logObject.module}]: ${logObject.message}`,
      `color: ${color}; font-weight: bold`,
      logObject.data || ''
    );
  }
};

// API pública do logger
const logger = {
  debug: (module, message, data) => {
    const logObject = formatLogMessage(LOG_LEVELS.DEBUG, module, message, data);
    sendLog(logObject, LOG_LEVELS.DEBUG);
  },

  info: (module, message, data) => {
    const logObject = formatLogMessage(LOG_LEVELS.INFO, module, message, data);
    sendLog(logObject, LOG_LEVELS.INFO);
  },

  warn: (module, message, data) => {
    const logObject = formatLogMessage(LOG_LEVELS.WARN, module, message, data);
    sendLog(logObject, LOG_LEVELS.WARN);
  },

  error: (module, message, data) => {
    const logObject = formatLogMessage(LOG_LEVELS.ERROR, module, message, data);
    sendLog(logObject, LOG_LEVELS.ERROR);
  },

  // Facilitar o log de erros de API
  apiError: (module, endpoint, error) => {
    const errorData = {
      endpoint,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    };
    
    logger.error(module, `Erro na API: ${endpoint}`, errorData);
  }
};

export default logger; 