const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ItemVenda = sequelize.define('itens_venda', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        venda_id: { type: DataTypes.INTEGER, allowNull: false },
        produto_id: { type: DataTypes.INTEGER, allowNull: false },
        quantidade: { type: DataTypes.INTEGER, allowNull: false },
        preco_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
    }, {
        tableName: 'itens_venda',
        timestamps: false
    });

    return ItemVenda;
};
