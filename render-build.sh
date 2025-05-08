#!/usr/bin/env bash
# Render build script for React apps

echo "Installing dependencies..."
npm install

echo "Installing webpack-cli..."
npm install --no-save webpack-cli

echo "Building application..."
npm run build

echo "Build completed!" 