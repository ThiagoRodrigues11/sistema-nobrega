const API_URL = 'http://localhost:5000/api';

export async function getPosts() {
  const res = await fetch(`${API_URL}/posts`);
  if (!res.ok) throw new Error('Erro ao buscar posts');
  return await res.json();
}

export async function getPostById(id) {
  const res = await fetch(`${API_URL}/posts/${id}`);
  if (!res.ok) throw new Error('Erro ao buscar post');
  return await res.json();
}

export async function deletePost(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  if (!res.ok) throw new Error('Erro ao apagar post');
  return await res.json();
}

export async function deleteComment(comentarioId, usuarioId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/posts/comentarios/${comentarioId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify({ usuario_id: usuarioId })
  });
  if (!res.ok) throw new Error('Erro ao apagar comentário');
  return await res.json();
}

export async function postComment(postId, conteudo, parentId, usuarioId) {
  const token = localStorage.getItem('token');
  const body = { conteudo, usuario_id: usuarioId };
  if (parentId) body.resposta_a = parentId;
  const res = await fetch(`${API_URL}/posts/${postId}/comentarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('Erro ao comentar');
  return await res.json();
}