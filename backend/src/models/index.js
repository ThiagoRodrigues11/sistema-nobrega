// src/models/index.js
const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

console.log('Iniciando conexão com o banco...');
console.log('Configurações do banco:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  '', 
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: console.log,
    define: { timestamps: false },
    dialectOptions: {
      connectTimeout: 60000,
      timeout: 60000,
      acquire: 60000,
      useUTC: false,
      ssl: false,
      requireSSL: false
    },
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Testar conexão
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  })
  .catch(err => {
    console.error('Erro ao conectar com o banco de dados:', err);
  });

module.exports = sequelize;
