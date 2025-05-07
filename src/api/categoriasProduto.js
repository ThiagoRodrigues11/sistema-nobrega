const API_URL = 'http://localhost:5000/api';

export async function getCategoriasProduto() {
  const res = await fetch(`${API_URL}/categorias-produto`);
  if (!res.ok) throw new Error('Erro ao buscar categorias de produto');
  return await res.json();
}

export async function createCategoriaProduto(categoria) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/categorias-produto`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(categoria)
  });
  if (!res.ok) throw new Error('Erro ao criar categoria de produto');
  return await res.json();
}

export async function updateCategoriaProduto(id, categoria) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/categorias-produto/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(categoria)
  });
  if (!res.ok) throw new Error('Erro ao atualizar categoria de produto');
  return await res.json();
}

export async function deleteCategoriaProduto(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/categorias-produto/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  if (!res.ok) throw new Error('Erro ao deletar categoria de produto');
  return await res.json();
}
