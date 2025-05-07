const API_URL = 'http://localhost:5000/api';

export async function getCategorias() {
  const res = await fetch(`${API_URL}/categorias`);
  if (!res.ok) throw new Error('Erro ao buscar categorias');
  return await res.json();
}

export async function createCategoria(categoria) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/categorias`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(categoria)
  });
  if (!res.ok) throw new Error('Erro ao criar categoria');
  return await res.json();
}

export async function updateCategoria(id, categoria) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/categorias/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(categoria)
  });
  if (!res.ok) throw new Error('Erro ao atualizar categoria');
  return await res.json();
}

export async function deleteCategoria(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/categorias/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  if (!res.ok) throw new Error('Erro ao deletar categoria');
  return await res.json();
}