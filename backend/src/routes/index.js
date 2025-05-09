const  = require 'express';
const  = require './auth.js';
const  = require './produtos.js';
const  = require './vendas.js';
const  = require './categorias.js';
const  = require './categorias_produto.js';
const  = require './posts.js';
const  = require './usuarios.js';
const  = require './upload.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/produtos', produtosRoutes);
router.use('/vendas', vendasRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/categorias-produto', categoriasProdutoRoutes);
router.use('/posts', postsRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
