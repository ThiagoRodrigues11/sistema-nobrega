import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const Post = sequelize.define('posts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  autor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  imagem: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  pdf: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  video: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  youtube: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
});

export default Post;