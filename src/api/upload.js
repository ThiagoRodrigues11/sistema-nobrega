import { post } from './api';

export async function uploadImagem(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    throw new Error('Erro ao fazer upload da imagem');
  }
}
