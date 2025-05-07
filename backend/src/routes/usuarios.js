import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Usuario from '../models/usuario.js';
import jwt from 'jsonwebtoken';

const router = Router();

// Middleware para checar se é admin
function isAdmin(req, res, next) {
  // Tenta pegar o token do header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Busca o usuário pelo id do token
    Usuario.findById(decoded.id).then(user => {
      if (!user || !(user.role === 'admin' || user.isAdmin || user.nivel_acesso === 'admin')) {
        return res.status(403).json({ message: 'Acesso negado. Apenas admins.' });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}

// Listar todos os usuários (apenas admin)
router.get('/', isAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
});

// Criar usuário (apenas admin)
router.post('/', isAdmin, async (req, res) => {
  try {
    console.log('POST /usuarios chamado');
    console.log('Body recebido:', req.body);
    const { nome, email, senha, role, username } = req.body;
    if (!nome || !email || !senha) {
      console.log('Faltando campos obrigatórios');
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    }
    const existe = await Usuario.findOne({ email });
    if (existe) {
      console.log('Email já cadastrado:', email);
      return res.status(409).json({ message: 'Email já cadastrado.' });
    }
    const hash = await bcrypt.hash(senha, 10);
    const novoUsuario = new Usuario({
      nome,
      email,
      username,
      password: hash,
      nivel_acesso: role === 'admin' ? 'admin' : 'blog',
    });
    await novoUsuario.save();
    console.log('Usuário criado com sucesso:', novoUsuario);
    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (err) {
    console.log('Erro ao criar usuário:', err);
    res.status(500).json({ message: 'Erro ao criar usuário.', error: err.message });
  }
});

// Buscar usuário por ID (apenas admin)
router.get('/:id', isAdmin, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar usuário.' });
  }
});

// Atualizar usuário por ID (apenas admin)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const updates = { ...req.body };
    // Se for enviada nova senha, criptografe
    if (updates.senha) {
      updates.password = await bcrypt.hash(updates.senha, 10);
      delete updates.senha;
    }
    // Não permita trocar o _id
    delete updates._id;
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar usuário.', error: err.message });
  }
});

export default router;
