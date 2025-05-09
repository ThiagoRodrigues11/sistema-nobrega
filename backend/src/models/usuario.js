const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize) => {
    const Usuario = sequelize.define('usuarios', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        nome: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        senha: { type: DataTypes.STRING, allowNull: false },
        telefone: { type: DataTypes.STRING, allowNull: true },
        foto_perfil: { type: DataTypes.STRING, allowNull: true },
        data_nascimento: { type: DataTypes.DATE, allowNull: true },
        tipo: { type: DataTypes.ENUM('admin', 'cliente'), defaultValue: 'cliente' }
    }, {
        tableName: 'usuarios',
        timestamps: false
    });

    Usuario.beforeCreate(async (usuario) => {
        if (usuario.senha) {
            usuario.senha = await bcrypt.hash(usuario.senha, 10);
        }
    });

    Usuario.prototype.validarSenha = async function(senha) {
        return bcrypt.compare(senha, this.senha);
    };

    Usuario.prototype.gerarToken = function() {
        return jwt.sign(
            { id: this.id, email: this.email, tipo: this.tipo },
            process.env.JWT_SECRET || 'seu-segredo-aqui',
            { expiresIn: '24h' }
        );
    };

    return Usuario;
};
