@echo off
echo ==> Preparando deploy para o Render...

REM Verifica se o npm está instalado
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Erro: npm não encontrado. Por favor, instale o Node.js
    exit /b 1
)

REM Instala as dependências
echo ==> Instalando dependências...
call npm install

REM Constrói a aplicação
echo ==> Construindo a aplicação...
call npm run build

REM Verifica se a build foi bem-sucedida
if not exist ".\build\" (
    echo Erro: A pasta build não foi criada. Verifique os erros acima.
    exit /b 1
)

REM Verifica se o arquivo static.json existe
if not exist ".\static.json" (
    echo ==> Criando arquivo static.json...
    (
        echo {
        echo   "root": "build/",
        echo   "routes": {
        echo     "/**": "index.html"
        echo   },
        echo   "https_only": true,
        echo   "headers": {
        echo     "/**": {
        echo       "Access-Control-Allow-Origin": "*",
        echo       "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        echo       "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Origin",
        echo       "Access-Control-Allow-Credentials": "true",
        echo       "Access-Control-Max-Age": "86400"
        echo     }
        echo   }
        echo }
    ) > static.json
)

REM Verifica se o arquivo Procfile existe
if not exist ".\Procfile" (
    echo ==> Criando arquivo Procfile...
    echo web: npx serve -s build > Procfile
)

echo ==> Deploy preparado com sucesso!
echo.
echo Instruções para deploy no Render:
echo 1. Faça commit das alterações: git add . ^&^& git commit -m "Prepara para deploy no Render"
echo 2. Envie para o GitHub: git push origin master
echo 3. No dashboard do Render, configure um novo serviço web:
echo    - Tipo: Web Service
echo    - Build Command: npm install ^&^& npm run build
echo    - Start Command: npx serve -s build
echo    - Variáveis de ambiente:
echo      NODE_ENV=production
echo      PORT=10000
echo.
echo 4. Adicione estas headers no painel do Render:
echo    - Path: /*
echo    - Name: Access-Control-Allow-Origin
echo    - Value: *
echo.
echo 5. Repita para os outros headers em static.json
echo.
echo Lembre-se de verificar os logs no Render após o deploy!
pause 