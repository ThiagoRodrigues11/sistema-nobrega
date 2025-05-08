import { Sequelize } from 'sequelize';

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('usuarios', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: Sequelize.STRING(50), unique: true },
    password: { type: Sequelize.STRING(255) },
    nome: { type: Sequelize.STRING(100) },
    email: { type: Sequelize.STRING(100) },
    nivel_acesso: { type: Sequelize.ENUM('admin', 'pdv', 'blog') },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
  });

  await queryInterface.createTable('categorias_produto', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: Sequelize.STRING(100) },
    descricao: { type: Sequelize.TEXT },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
  });

  await queryInterface.createTable('produtos', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: Sequelize.STRING(100) },
    descricao: { type: Sequelize.TEXT },
    preco: { type: Sequelize.DECIMAL(10,2) },
    estoque: { type: Sequelize.INTEGER },
    categoria_produto_id: { type: Sequelize.INTEGER, references: { model: 'categorias_produto', key: 'id' } },
    imagem: { type: Sequelize.STRING(255) },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
  });

  await queryInterface.createTable('vendas', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: { type: Sequelize.INTEGER, references: { model: 'usuarios', key: 'id' } },
    total: { type: Sequelize.DECIMAL(10,2) },
    status: { type: Sequelize.ENUM('pendente', 'concluida', 'cancelada') },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
  });

  await queryInterface.createTable('itens_venda', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    venda_id: { type: Sequelize.INTEGER, references: { model: 'vendas', key: 'id' } },
    produto_id: { type: Sequelize.INTEGER, references: { model: 'produtos', key: 'id' } },
    quantidade: { type: Sequelize.INTEGER },
    preco_unitario: { type: Sequelize.DECIMAL(10,2) }
  });

  await queryInterface.createTable('posts', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    titulo: { type: Sequelize.STRING(200) },
    conteudo: { type: Sequelize.TEXT },
    autor_id: { type: Sequelize.INTEGER, references: { model: 'usuarios', key: 'id' } },
    imagem: { type: Sequelize.STRING(255) },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
  });

  await queryInterface.createTable('comentarios', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    post_id: { type: Sequelize.INTEGER, references: { model: 'posts', key: 'id' } },
    usuario_id: { type: Sequelize.INTEGER, references: { model: 'usuarios', key: 'id' } },
    conteudo: { type: Sequelize.TEXT },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('comentarios');
  await queryInterface.dropTable('posts');
  await queryInterface.dropTable('itens_venda');
  await queryInterface.dropTable('vendas');
  await queryInterface.dropTable('produtos');
  await queryInterface.dropTable('categorias_produto');
  await queryInterface.dropTable('usuarios');
}
