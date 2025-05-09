const express = require('express');
const CategoriaProduto = require('../models/categoria_produto.js');

const router = express.Router();

// Listar categorias de produto
router.get('/', async (req, res) => {
  try {
    const categorias = await CategoriaProduto.findAll();
    res.json(categorias);
  } catch (err) {
    console.error('Erro ao listar categorias de produto:', err);
    res.status(500).json({ message: 'Erro ao buscar categorias de produto', error: err.message });
  }
});

// Criar categoria de produto
router.post('/', async (req, res) => {
  try {
    if (!req.body.nome || typeof req.body.nome !== 'string' || req.body.nome.trim() === '') {
      return res.status(400).json({ message: 'O campo nome é obrigatório.' });
    }

    const categoria = await CategoriaProduto.create(req.body);
    res.json(categoria);
  } catch (err) {
    console.error('Erro ao criar categoria de produto:', err);
    res.status(500).json({ message: 'Erro ao criar categoria de produto', error: err.message });
  }
});

// Atualizar categoria de produto
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await CategoriaProduto.update(req.body, {
      where: { id: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Categoria não encontrada' });

    const categoria = await CategoriaProduto.findByPk(req.params.id);
    res.json(categoria);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deletar categoria de produto
router.delete('/:id', async (req, res) => {
  try {
    const categoria = await CategoriaProduto.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ message: 'Categoria não encontrada' });

    await categoria.destroy();
    res.json({ message: 'Categoria removida' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
