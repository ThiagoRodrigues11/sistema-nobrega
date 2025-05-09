const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Venda = sequelize.define('vendas', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        usuario_id: { type: DataTypes.INTEGER, allowNull: false },
        data_venda: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        valor_total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        status: { type: DataTypes.ENUM('pendente', 'pagamento', 'envio', 'entregue', 'cancelado'), defaultValue: 'pendente' }
    }, {
        tableName: 'vendas',
        timestamps: false
    });

    return Venda;
};
