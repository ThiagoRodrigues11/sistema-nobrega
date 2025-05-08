/**
 * Script para testar automaticamente as configurações de CORS
 * 
 * Uso: node test-cors.js [API_URL]
 * 
 * Exemplo: node test-cors.js https://sistema-nobrega-1.onrender.com
 */

// Dependências
const https = require('https');
const http = require('http');
const URL = require('url').URL;

// Parâmetros
const API_URL = process.argv[2] || 'https://sistema-nobrega-1.onrender.com';
const ENDPOINTS = [
  '/api/auth/login',
  '/api/users',
  '/test-cors',
  '/api/auth/test-cors'
];
const ORIGINS = [
  'https://vestalize.com',
  'http://localhost:3000',
  'https://sistema-nobrega.netlify.app'
];

// Cores para console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Realiza uma requisição HTTP/HTTPS para testar CORS
 * @param {string} url - URL a ser testada
 * @param {string} origin - Origem para o header Origin
 * @param {string} method - Método HTTP
 * @returns {Promise} - Promessa resolvida com a resposta ou erro
 */
function testCORS(url, origin, method = 'GET') {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname,
      method: method,
      headers: {
        'Origin': origin,
        'Content-Type': 'application/json'
      }
    };

    const requester = parsedUrl.protocol === 'https:' ? https : http;
    
    // Preflight request para OPTIONS
    if (method === 'OPTIONS') {
      options.headers['Access-Control-Request-Method'] = 'GET';
      options.headers['Access-Control-Request-Headers'] = 'Content-Type, Authorization';
    }

    const req = requester.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data ? JSON.parse(data) : null
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

/**
 * Imprime os resultados de um teste CORS
 * @param {string} url - URL testada
 * @param {string} origin - Origem testada
 * @param {string} method - Método HTTP
 * @param {object} result - Resultado do teste
 */
function printResult(url, origin, method, result) {
  const hasAccessControl = result.headers && 
                          result.headers['access-control-allow-origin'];
  const isAllowed = hasAccessControl && 
                   (result.headers['access-control-allow-origin'] === '*' || 
                    result.headers['access-control-allow-origin'] === origin);
  
  console.log(`${colors.bright}Teste: ${colors.reset}${url}`);
  console.log(`${colors.bright}Origem: ${colors.reset}${origin}`);
  console.log(`${colors.bright}Método: ${colors.reset}${method}`);
  console.log(`${colors.bright}Status: ${colors.reset}${result.status}`);
  
  if (hasAccessControl) {
    console.log(`${colors.bright}Allow-Origin: ${colors.reset}${result.headers['access-control-allow-origin']}`);
    if (result.headers['access-control-allow-methods']) {
      console.log(`${colors.bright}Allow-Methods: ${colors.reset}${result.headers['access-control-allow-methods']}`);
    }
    if (result.headers['access-control-allow-headers']) {
      console.log(`${colors.bright}Allow-Headers: ${colors.reset}${result.headers['access-control-allow-headers']}`);
    }
  } else {
    console.log(`${colors.bright}Headers CORS: ${colors.red}Não encontrados${colors.reset}`);
  }
  
  console.log(`${colors.bright}Resultado: ${isAllowed ? colors.green + 'PERMITIDO' : colors.red + 'BLOQUEADO'}${colors.reset}`);
  console.log('-'.repeat(80));
}

/**
 * Executa os testes de CORS
 */
async function runTests() {
  console.log(`${colors.cyan}${colors.bright}=== TESTE DE CONFIGURAÇÃO CORS ===${colors.reset}\n`);
  console.log(`${colors.cyan}API: ${API_URL}${colors.reset}\n`);
  
  // Testar cada combinação de endpoint e origem
  for (const endpoint of ENDPOINTS) {
    for (const origin of ORIGINS) {
      const url = `${API_URL}${endpoint}`;
      
      try {
        // Testar preflight OPTIONS
        console.log(`\n${colors.blue}${colors.bright}TESTANDO PREFLIGHT OPTIONS${colors.reset}\n`);
        const optionsResult = await testCORS(url, origin, 'OPTIONS');
        printResult(url, origin, 'OPTIONS', optionsResult);
        
        // Testar GET normal
        console.log(`\n${colors.blue}${colors.bright}TESTANDO GET NORMAL${colors.reset}\n`);
        const getResult = await testCORS(url, origin, 'GET');
        printResult(url, origin, 'GET', getResult);
      } catch (error) {
        console.log(`${colors.red}Erro ao testar ${url} com origem ${origin}: ${error.message}${colors.reset}`);
      }
    }
  }
  
  console.log(`\n${colors.cyan}${colors.bright}=== TESTES CONCLUÍDOS ===${colors.reset}\n`);
}

// Executa os testes
runTests(); 