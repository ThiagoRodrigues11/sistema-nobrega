﻿const { DataTypes } = require('sequelize');
const sequelize = require('./index.js');

module.exports = (sequelize) => {
    const CategoriaProduto = sequelize.define('CategoriaProduto', {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'categorias_produtos',
        timestamps: false
    });

    return CategoriaProduto;
};
