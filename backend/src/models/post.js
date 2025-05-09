const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Post = sequelize.define('posts', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        titulo: { type: DataTypes.STRING, allowNull: false },
        conteudo: { type: DataTypes.TEXT, allowNull: false },
        autor_id: { type: DataTypes.INTEGER, allowNull: false },
        categoria_id: { type: DataTypes.INTEGER, allowNull: false },
        data_publicacao: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    }, {
        tableName: 'posts',
        timestamps: false
    });

    return Post;
};
