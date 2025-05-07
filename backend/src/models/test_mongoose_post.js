const mongoose = require('mongoose');
import Post from './Post.js';

async function testMongoosePost() {
  try {
    await mongoose.connect('mongodb://localhost:27017/nobrega-confeccoes-test', {
      // useNewUrlParser: true, // não precisa mais
      // useUnifiedTopology: true, // não precisa mais
    });
    console.log('Conectado ao MongoDB para teste!');

    // Teste de criação de post
    const novoPost = await Post.create({
      titulo: 'Teste Mongoose',
      conteudo: 'Conteudo do teste',
      autor_id: new mongoose.Types.ObjectId(),
      imagem: 'imagem_teste.png',
      pdf: 'arquivo_teste.pdf',
      video: 'video_teste.mp4',
      categoria: new mongoose.Types.ObjectId(),
    });
    console.log('Post criado:', novoPost);

    // Buscar o post criado
    const postEncontrado = await Post.findById(novoPost._id).lean();
    console.log('Post encontrado no banco:', postEncontrado);

    // Verificar se os campos pdf e video existem
    if (postEncontrado.pdf && postEncontrado.video) {
      console.log('Os campos pdf e video foram salvos corretamente!');
    } else {
      console.log('Os campos pdf e/ou video NÃO foram salvos!');
    }

    // Limpeza: remover o post de teste
    await Post.deleteOne({ _id: novoPost._id });
    console.log('Post de teste removido.');

    await mongoose.disconnect();
    console.log('Desconectado do MongoDB.');
  } catch (err) {
    console.error('Erro no teste do Mongoose:', err);
  }
}

if (require.main === module) {
  testMongoosePost();
}
