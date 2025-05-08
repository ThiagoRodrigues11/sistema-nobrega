import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const ItensVenda = sequelize.define('itens_venda', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  venda_id: { type: DataTypes.INTEGER },
  produto_id: { type: DataTypes.INTEGER },
  quantidade: { type: DataTypes.INTEGER },
  preco_unitario: { type: DataTypes.DECIMAL(10,2) }
}, {
  timestamps: false
});

export default ItensVenda;
