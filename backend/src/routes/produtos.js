import { Router } from 'express';
import Produto from '../models/produto.js';
import CategoriaProduto from '../models/categoria_produto.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = Router();

// Listar produtos
router.get('/', async (req, res) => {
  try {
    const produtos = await Produto.findAll({
      include: [
        {
          model: CategoriaProduto,
          as: 'categoria_produto'
        }
      ]
    });
    console.log('Produtos retornados pelo backend:', JSON.stringify(produtos, null, 2));
    res.json(produtos);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).json({ message: err.message });
  }
});

// Criar produto (admin)
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const produto = await Produto.create(req.body);
    res.json(produto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Atualizar produto (admin)
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const [updated] = await Produto.update(req.body, {
      where: { id: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Produto não encontrado' });

    const produto = await Produto.findByPk(req.params.id);
    res.json(produto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deletar produto (admin)
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });

    await produto.destroy();
    res.json({ message: 'Produto removido' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
