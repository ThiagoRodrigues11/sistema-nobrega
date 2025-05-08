import { get, post, del } from '../api';

const API_URL = 'http://localhost:5000/api';

export async function getPosts() {
  try {
    const response = await get(`${API_URL}/posts`);
    return response;
  } catch (error) {
    throw new Error('Erro ao buscar posts');
  }
}

export async function getPostById(id) {
  try {
    const response = await get(`${API_URL}/posts/${id}`);
    return response;
  } catch (error) {
    throw new Error('Erro ao buscar post');
  }
}

export async function deletePost(id) {
  try {
    await del(`${API_URL}/posts/${id}`);
  } catch (error) {
    throw new Error('Erro ao deletar post');
  }
}

export async function deleteComment(comentarioId, usuarioId) {
  try {
    await del(`${API_URL}/posts/comentarios/${comentarioId}`);
  } catch (error) {
    throw new Error('Erro ao deletar comentário');
  }
}

export async function postComment(postId, conteudo, parentId, usuarioId) {
  try {
    const response = await post(`${API_URL}/posts/${postId}/comentarios`, {
      conteudo,
      parentId,
      usuarioId
    });
    return response;
  } catch (error) {
    throw new Error('Erro ao postar comentário');
  }
}