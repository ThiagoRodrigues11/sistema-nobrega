# Guia de Deploy no Render

Este guia contém instruções detalhadas para implantar o Sistema Nobrega no Render, incluindo as melhorias de configuração CORS e de manifesto.

## 1. Preparação para o Deploy

Execute o script automatizado para preparar o deploy:

```bash
# Tornar o script executável (em sistemas Unix/Linux/MacOS)
chmod +x render-build.sh

# Executar o script
./render-build.sh
```

Ou siga os passos manuais:

1. Instale as dependências
   ```bash
   npm install
   ```

2. Construa a aplicação
   ```bash
   npm run build
   ```

## 2. Configuração do Render

### Opção 1: Configuração via Dashboard

1. No dashboard do Render, crie um novo Web Service:
   - **Build Command**: `./render-build.sh`
   - **Start Command**: `npx serve -s build`

2. Configure as variáveis de ambiente:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `JWT_SECRET`: (Gere um valor aleatório ou deixe o Render gerar)
   - `SESSION_SECRET`: (Gere um valor aleatório ou deixe o Render gerar)

3. Adicione os Headers CORS na seção Headers do Render:
   - Path: `/*`
   - Name: `Access-Control-Allow-Origin`
   - Value: `*`

   Repita para os seguintes headers:
   - `Access-Control-Allow-Methods`: `GET, POST, PUT, DELETE, OPTIONS`
   - `Access-Control-Allow-Headers`: `Content-Type, Authorization, X-Requested-With, Origin`
   - `Access-Control-Allow-Credentials`: `true`
   - `Access-Control-Max-Age`: `86400`

### Opção 2: Usando o arquivo static.json (para Static Sites no Render)

1. Certifique-se de que o arquivo `static.json` existe na raiz do projeto. O conteúdo deve ser:
   ```json
   {
     "root": "build/",
     "routes": {
       "/**": "index.html"
     },
     "https_only": true,
     "headers": {
       "/**": {
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
         "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Origin",
         "Access-Control-Allow-Credentials": "true",
         "Access-Control-Max-Age": "86400"
       }
     }
   }
   ```

2. No dashboard do Render, escolha "Static Site" em vez de "Web Service".

## 3. Verificação e Solução de Problemas

### Teste Automatizado de CORS

Execute o script de teste CORS para verificar se as configurações estão funcionando corretamente:

```bash
# Instalar as dependências (necessário apenas uma vez)
npm install

# Executar o teste (substitua a URL se necessário)
node scripts/test-cors.js https://sistema-nobrega-1.onrender.com
```

Este script verificará a configuração CORS para vários endpoints e origens, ajudando a diagnosticar problemas.

### Logs da Aplicação

O sistema agora usa logs estruturados para facilitar a depuração. Verifique o console do navegador para ver logs formatados em desenvolvimento, ou os logs do Render em produção.

Os logs incluem:
- Níveis de severidade (debug, info, warn, error)
- Timestamp
- Módulo/componente
- Mensagem
- Dados estruturados

### Erro de CORS

Se ainda houver erros de CORS:

1. Verifique se o backend está configurado corretamente:
   - Certifique-se de que o arquivo `backend/server.js` tenha a configuração CORS atualizada
   - Verifique se o arquivo `config.js` está com as origens corretas configuradas

2. Teste a API manualmente no console do navegador:
   ```javascript
   fetch('https://sistema-nobrega-1.onrender.com/api/auth/test-cors', {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json',
       'Origin': 'https://vestalize.com'
     },
     credentials: 'include'
   }).then(r => r.json()).then(console.log)
   ```

### Erro de Manifesto

Se houver erro no manifesto:

1. Verifique se o arquivo `public/manifest.json` existe e está corretamente formatado.
2. Certifique-se de que o arquivo está sendo servido pelo Render.
3. Verifique se o arquivo `public/index.html` está referenciando o manifesto corretamente:
   ```html
   <link rel="manifest" href="%PUBLIC_URL%/manifest.json" crossorigin="use-credentials" />
   ```

### Outros Problemas

1. Verifique os logs no painel do Render para identificar erros específicos.
2. Teste a aplicação em modo de desenvolvimento localmente:
   ```bash
   npm start
   ```
3. Limpe o cache do navegador e localStorage:
   ```javascript
   localStorage.clear()
   ```

## 4. Estrutura do Projeto Melhorada

O projeto foi refatorado para melhorar a organização e manutenibilidade:

### Arquivos de Configuração Centralizados

- `src/config.js`: Configurações centralizadas baseadas em ambiente
- `backend/server.js`: Configuração CORS simplificada e unificada

### Sistema de Logs Estruturados

- `src/utils/logger.js`: Sistema de logs estruturados com diferentes níveis
- Logs coloridos em desenvolvimento e formatados para produção

### Scripts de Teste

- `scripts/test-cors.js`: Ferramenta para testar configurações CORS

## 5. Monitoramento

1. Após o deploy, monitore os logs no painel do Render para identificar possíveis erros.
2. Use o console do navegador para verificar os logs estruturados.
3. Teste o login e outras funcionalidades críticas após o deploy. 