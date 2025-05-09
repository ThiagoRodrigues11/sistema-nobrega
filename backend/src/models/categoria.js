const { DataTypes } = require('sequelize');
const sequelize = require('./index.js');

module.exports = (sequelize) => {
    const Categoria = sequelize.define('Categoria', {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'categorias',
        timestamps: false
    });

    return Categoria;
};
