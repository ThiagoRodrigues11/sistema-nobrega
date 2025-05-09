const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Produto = sequelize.define('Produto', {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        preco: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        estoque: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        imagem: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'produtos',
        timestamps: false
    });

    return Produto;
};
