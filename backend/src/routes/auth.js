import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.js';

const router = Router();

// Middleware para verificar token
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Username e senha são obrigatórios' });
    }

    try {
        const user = await Usuario.findOne({ 
            where: { username },
            attributes: ['id', 'username', 'password', 'nome', 'nivel_acesso', 'email']
        });

        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
        );

        // Não retornar a senha
        const { password: _, ...userData } = user.toJSON();

        req.session.user = userData;
        
        res.json({
            token,
            user: userData
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'Logout efetuado' });
    });
});

// Verificar usuário logado
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await Usuario.findByPk(req.userId, {
            attributes: ['id', 'username', 'nome', 'nivel_acesso', 'email']
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json(user);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

export default router;
