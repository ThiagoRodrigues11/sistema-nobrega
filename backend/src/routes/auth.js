import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.js';

const router = Router();

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
      { 
        id: user.id, 
        username: user.username,
        nivel_acesso: user.nivel_acesso 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Remove password from user object
    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      nome: user.nome,
      email: user.email,
      nivel_acesso: user.nivel_acesso
    };

    req.session.user = userWithoutPassword;
    
    res.json({
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ message: 'Erro no login', error: err.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logout efetuado' });
  });
});

// Verifica autenticação por JWT
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await Usuario.findByPk(decoded.id, {
      attributes: ['id', 'username', 'nome', 'email', 'nivel_acesso']
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Erro na verificação do token:', err);
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
});

export default router;
