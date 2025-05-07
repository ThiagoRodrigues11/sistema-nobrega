import { Router } from 'express';
import authRoutes from './auth.js';
import produtosRoutes from './produtos.js';
import vendasRoutes from './vendas.js';
import categoriasRoutes from './categorias.js';
import categoriasProdutoRoutes from './categorias_produto.js';
import postsRoutes from './posts.js';
import usuariosRoutes from './usuarios.js';
import uploadRoutes from './upload.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/produtos', produtosRoutes);
router.use('/vendas', vendasRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/categorias-produto', categoriasProdutoRoutes);
router.use('/posts', postsRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/upload', uploadRoutes);

export default router;
