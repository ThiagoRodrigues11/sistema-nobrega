const webpack = require('webpack');
const path = require('path');

module.exports = {
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://sistema-nobrega-1.onrender.com/api',
        changeOrigin: true,
      },
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      return middlewares;
    },
  },
};