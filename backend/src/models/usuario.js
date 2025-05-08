import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const Usuario = sequelize.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
    // Removido o índice único do email para evitar o erro de "Too many keys"
    // A unicidade do email será garantida no nível da aplicação
  },
  nivel_acesso: {
    type: DataTypes.ENUM('admin', 'pdv', 'blog'),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['username']
    }
  ]
});

export default Usuario;
