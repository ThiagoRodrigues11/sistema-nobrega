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

// Rota de teste CORS
router.get('/test-cors', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin');
    res.json({ message: 'CORS test successful' });
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Username e senha são obrigatórios' });
    }

    try {
        const usuario = await Usuario.findOne({ where: { username } });
        if (!usuario) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos' });
        }

        const isValidPassword = await bcrypt.compare(password, usuario.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos' });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET || 'your-secret-key', {
            expiresIn: '24h'
        });

        res.json({
            token,
            user: {
                id: usuario.id,
                username: usuario.username,
                email: usuario.email
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Logout
router.post('/logout', authMiddleware, (req, res) => {
    res.json({ message: 'Logout realizado com sucesso' });
});

// Obter informações do usuário logado
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.userId);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json({
            user: {
                id: usuario.id,
                username: usuario.username,
                email: usuario.email
            }
        });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

export default router;
