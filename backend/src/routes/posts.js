const express = require('express');
const Post = require('../models/post.js');
const Comentario = require('../models/comentario.js');
const Usuario = require('../models/usuario.js');
const Categoria = require('../models/categoria.js');
const { authenticateToken } = require('../middleware/auth.js');
const { deleteUploadsForPost } = require('../utils/deleteUploads.js');

const router = express.Router();

// Listar todos os posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['nome', 'email']
        },
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['nome']
        }
      ]
    });

    // Adiciona a contagem de comentários em cada post
    const postsWithCount = await Promise.all(posts.map(async post => {
      const comentariosCount = await Comentario.count({
        where: { post_id: post.id }
      });
      return {
        ...post.toJSON(),
        comentariosCount
      };
    }));

    res.json(postsWithCount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Detalhar um post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['nome', 'email']
        },
        {
          model: Categoria,
          as: 'categoria'
        }
      ]
    });

    if (!post) return res.status(404).json({ message: 'Post não encontrado' });

    // Buscar comentários relacionados a este post
    const comentarios = await Comentario.findAll({
      where: { post_id: post.id },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['nome', 'email']
        }
      ]
    });

    const postObj = post.toJSON();
    postObj.comentarios = comentarios;
    res.json(postObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Criar post (autenticado)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { created_at, updated_at, ...rest } = req.body;
    rest.autor_id = req.user.id;
    
    const post = await Post.create(rest);
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Adicionar comentário
router.post('/:postId/comentarios', authenticateToken, async (req, res) => {
  try {
    const { conteudo, resposta_a } = req.body;
    const postId = req.params.postId;
    const usuarioId = req.user.id;

    const comentario = await Comentario.create({
      post_id: postId,
      usuario_id: usuarioId,
      conteudo,
      resposta_a
    });

    // Buscar o comentário com os dados do usuário
    const comentarioCompleto = await Comentario.findByPk(comentario.id, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['nome', 'email']
        }
      ]
    });

    res.json(comentarioCompleto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Editar post
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Post.update(req.body, {
      where: { id: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Post não encontrado' });

    const post = await Post.findByPk(req.params.id);
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deletar post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post não encontrado' });

    await post.destroy();
    deleteUploadsForPost(post);
    res.json({ message: 'Post removido' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deletar comentário
router.delete('/comentarios/:comentarioId', async (req, res) => {
  try {
    const comentario = await Comentario.findByPk(req.params.comentarioId);
    if (!comentario) return res.status(404).json({ message: 'Comentário não encontrado' });

    if (comentario.usuario_id !== req.body.usuario_id) {
      return res.status(403).json({ message: 'Sem permissão para apagar este comentário' });
    }

    await comentario.destroy();
    res.json({ message: 'Comentário removido' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
