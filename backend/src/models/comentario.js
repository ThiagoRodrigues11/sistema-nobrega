const { DataTypes } = require('sequelize');
const sequelize = require('./index.js');

module.exports = (sequelize) => {
    const Comentario = sequelize.define('Comentario', {
        conteudo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        resposta_a: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'comentarios',
        timestamps: false
    });

    return Comentario;
};
