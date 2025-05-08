#!/usr/bin/env bash
# Script de build para o Render

# Limpar cache do npm para evitar problemas
echo "Limpando cache do npm..."
npm cache clean --force

# Instalar dependências
echo "Instalando dependências..."
npm ci || npm install

# Verificar se o webpack-cli está instalado
if ! npm list webpack-cli >/dev/null 2>&1; then
  echo "Instalando webpack-cli..."
  npm install webpack-cli
fi

# Executar o build
echo "Construindo a aplicação..."
npm run build

echo "Build completado com sucesso!" 