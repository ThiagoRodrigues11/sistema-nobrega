const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Produto = sequelize.define('produtos', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        nome: { type: DataTypes.STRING, allowNull: false },
        descricao: { type: DataTypes.TEXT, allowNull: false },
        preco: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        estoque: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        categoria_produto_id: { type: DataTypes.INTEGER, allowNull: false },
        imagem: { type: DataTypes.STRING, allowNull: true }
    }, {
        tableName: 'produtos',
        timestamps: false
    });

    return Produto;
};
