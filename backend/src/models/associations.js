import Usuario from './usuario.js';
import Categoria from './categoria.js';
import CategoriaProduto from './categoria_produto.js';
import Produto from './produto.js';
import Venda from './venda.js';
import ItemVenda from './item_venda.js';
import Post from './post.js';
import Comentario from './comentario.js';

// Usuario associations
Usuario.hasMany(Venda, { foreignKey: 'usuario_id' });
Usuario.hasMany(Post, { foreignKey: 'autor_id' });
Usuario.hasMany(Comentario, { foreignKey: 'usuario_id' });

// Categoria associations
Categoria.hasMany(Post, { foreignKey: 'categoria_id' });

// CategoriaProduto associations
CategoriaProduto.hasMany(Produto, { foreignKey: 'categoria_produto_id', as: 'produtos' });

// Produto associations
Produto.belongsTo(CategoriaProduto, { foreignKey: 'categoria_produto_id', as: 'categoria_produto' });
Produto.hasMany(ItemVenda, { foreignKey: 'produto_id' });

// Venda associations
Venda.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Venda.hasMany(ItemVenda, { foreignKey: 'venda_id', as: 'itens' });

// ItemVenda associations
ItemVenda.belongsTo(Venda, { foreignKey: 'venda_id' });
ItemVenda.belongsTo(Produto, { foreignKey: 'produto_id' });

// Post associations
Post.belongsTo(Usuario, { foreignKey: 'autor_id' });
Post.belongsTo(Categoria, { foreignKey: 'categoria_id' });
Post.hasMany(Comentario, { foreignKey: 'post_id' });

// Comentario associations
Comentario.belongsTo(Post, { foreignKey: 'post_id' });
Comentario.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Comentario.belongsTo(Comentario, { foreignKey: 'resposta_a', as: 'resposta' });

// export {
//   Usuario,
//   Produto,
//   Categoria,
//   Venda,
//   ItensVenda,
//   Post,
//   Comentario
// };

