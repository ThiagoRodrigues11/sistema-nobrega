import { sequelize } from '../models/index.js';
import Categoria from '../models/categoria.js';
import dotenv from 'dotenv';

dotenv.config();

async function createCategoriaPost() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Verifica se a categoria já existe
    const categoriaExists = await Categoria.findOne({
      where: { nome: process.argv[2] }
    });

    if (categoriaExists) {
      console.log('Categoria já existe.');
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
  console.log('Por favor, forneça o nome da categoria.');
  console.log('Uso: node createCategoriaPost.js "Nome da Categoria" [descrição]');
  process.exit(1);
}

createCategoriaPost(); 