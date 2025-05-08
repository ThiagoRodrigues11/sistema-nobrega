import { Router } from 'express';
import Categoria from '../models/categoria.js';

const router = Router();

// Listar categorias
router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Criar categoria
router.post('/', async (req, res) => {
  try {
    const categoria = await Categoria.create(req.body);
    res.json(categoria);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Atualizar categoria
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Categoria.update(req.body, {
      where: { id: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Categoria não encontrada' });

    const categoria = await Categoria.findByPk(req.params.id);
    res.json(categoria);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deletar categoria
router.delete('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ message: 'Categoria não encontrada' });

    await categoria.destroy();
    res.json({ message: 'Categoria removida' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
