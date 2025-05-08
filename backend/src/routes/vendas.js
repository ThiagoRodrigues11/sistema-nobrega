import { Router } from 'express';
import Venda from '../models/venda.js';
import ItemVenda from '../models/item_venda.js';
import Produto from '../models/produto.js';
import Usuario from '../models/usuario.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = Router();

// Listar vendas (admin)
router.get('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const vendas = await Venda.findAll({
      include: [
        {
          model: Usuario,
          as: 'usuario'
        },
        {
          model: ItemVenda,
          as: 'itens',
          include: [
            {
              model: Produto,
              as: 'produto'
            }
          ]
        }
      ]
      });
    res.json(vendas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Criar venda
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { itens, ...vendaData } = req.body;
    vendaData.usuario_id = req.user.id;

    const venda = await Venda.create(vendaData);

    // Criar itens da venda
    if (itens && itens.length > 0) {
      const itensVenda = itens.map(item => ({
        ...item,
        venda_id: venda.id
      }));
      await ItemVenda.bulkCreate(itensVenda);
    }

    // Buscar venda com itens
    const vendaCompleta = await Venda.findByPk(venda.id, {
      include: [
        {
          model: ItemVenda,
          as: 'itens',
          include: [
            {
              model: Produto,
              as: 'produto'
            }
          ]
        }
      ]
    });

    res.json(vendaCompleta);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Atualizar status da venda (admin)
router.put('/:id/status', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const [updated] = await Venda.update(
      { status: req.body.status },
      { where: { id: req.params.id } }
    );

    if (!updated) return res.status(404).json({ message: 'Venda não encontrada' });

    const venda = await Venda.findByPk(req.params.id);
    res.json(venda);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deletar venda (admin)
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const venda = await Venda.findByPk(req.params.id);
    if (!venda) return res.status(404).json({ message: 'Venda não encontrada' });

    // Deletar itens da venda primeiro
    await ItemVenda.destroy({ where: { venda_id: venda.id } });
    
    // Deletar a venda
    await venda.destroy();
    res.json({ message: 'Venda removida' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
