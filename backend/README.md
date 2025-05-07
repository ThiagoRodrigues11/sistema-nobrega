# Backend Nobrega Confecções

## Como rodar

1. Copie `.env.example` para `.env` e configure os dados do seu MySQL.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Rode as migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```
4. Inicie o servidor:
   ```bash
   npm run dev
   ```

## Endpoints principais
- /api/auth
- /api/produtos
- /api/vendas
- /api/categorias
- /api/posts

## Estrutura
- Autenticação por JWT e sessão
- Níveis de acesso: admin, pdv, blog
- Segurança: SQL Injection, sanitização, validação
