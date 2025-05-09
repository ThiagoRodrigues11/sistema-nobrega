const  = require 'sequelize';
const  = require './index.js';

const Venda = sequelize.define('vendas', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuario_id: { type: DataTypes.INTEGER },
  total: { type: DataTypes.DECIMAL(10,2) },
  status: { type: DataTypes.ENUM('pendente', 'concluida', 'cancelada') },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false
});

module.exports = Venda;
