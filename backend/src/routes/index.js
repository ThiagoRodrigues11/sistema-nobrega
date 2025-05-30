﻿const express = require('express');
const authRoutes = require('./auth.js');
const produtosRoutes = require('./produtos.js');
const vendasRoutes = require('./vendas.js');
const categoriasRoutes = require('./categorias.js');
const categoriasProdutoRoutes = require('./categorias_produto.js');
const postsRoutes = require('./posts.js');
const usuariosRoutes = require('./usuarios.js');
const uploadRoutes = require('./upload.js');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/produtos', produtosRoutes);
router.use('/vendas', vendasRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/categorias-produto', categoriasProdutoRoutes);
router.use('/posts', postsRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
