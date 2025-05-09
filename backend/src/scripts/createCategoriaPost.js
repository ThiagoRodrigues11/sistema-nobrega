const  = require '../models/index.js';
const  = require '../models/categoria.js';
const  = require 'dotenv';

dotenv.config();

async function createCategoriaPost() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Verifica se a categoria jÃ¡ existe
    const categoriaExists = await Categoria.findOne({
      where: { nome: process.argv[2] }
    });

    if (categoriaExists) {
      console.log('Categoria jÃ¡ existe.');
      process.exit(0);
    }

    // Cria a categoria
    const categoria = await Categoria.create({
      nome: process.argv[2],
      descricao: process.argv[3] || ''
    });

    console.log('Categoria de post criada com sucesso:', categoria.nome);
    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    process.exit(1);
  }
}

// Verifica se o nome da categoria foi fornecido
if (!process.argv[2]) {
  console.log('Por favor, forneÃ§a o nome da categoria.');
  console.log('Uso: node createCategoriaPost.js "Nome da Categoria" [descriÃ§Ã£o]');
  process.exit(1);
}

createCategoriaPost(); 
