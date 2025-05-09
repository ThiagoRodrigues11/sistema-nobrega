const express = require require 'express';
const express = require require './auth.js';
const express = require require './produtos.js';
const express = require require './vendas.js';
const express = require require './categorias.js';
const express = require require './categorias_produto.js';
const express = require require './posts.js';
const express = require require './usuarios.js';
const express = require require './upload.js';

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
