const { DataTypes } = require('sequelize');

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
