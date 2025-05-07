const API_URL = 'http://localhost:5000/api';

export async function getProducts() {
  const res = await fetch(`${API_URL}/produtos`);
  if (!res.ok) throw new Error('Erro ao buscar produtos');
  return await res.json();
}

export async function getProductById(id) {
  const res = await fetch(`${API_URL}/produtos/${id}`);
  if (!res.ok) throw new Error('Erro ao buscar produto');
  return await res.json();
}

export async function createProduct(product) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/produtos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Erro ao criar produto');
  return await res.json();
}

export async function updateProduct(id, product) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/produtos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Erro ao atualizar produto');
  return await res.json();
}

export async function deleteProduct(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/produtos/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  if (!res.ok) throw new Error('Erro ao deletar produto');
  return await res.json();
}