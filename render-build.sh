#!/usr/bin/env bash
# Script de build para o Render

# Configurar como não-interativo para evitar prompts
export CI=true
export NPM_CONFIG_INTERACTIVE=false
export WEBPACK_CLI_SKIP_PROMPTS=true

# Limpar cache do npm para evitar problemas
echo "Limpando cache do npm..."
npm cache clean --force

# Instalar dependências
echo "Instalando dependências..."
npm ci || npm install

# Verificar se o webpack-cli está instalado e instalá-lo explicitamente se necessário
if ! npm list webpack-cli >/dev/null 2>&1; then
  echo "Instalando webpack-cli explicitamente..."
  npm install --save webpack-cli
fi

# Verificar se todas as dependências necessárias estão instaladas
echo "Verificando dependências de build..."
npm list webpack webpack-cli babel-loader css-loader style-loader path-browserify

# Executar o build em modo não-interativo
echo "Construindo a aplicação..."
CI=true npm run build

echo "Build completado com sucesso!" 