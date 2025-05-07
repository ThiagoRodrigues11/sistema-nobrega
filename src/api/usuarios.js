const API_URL = 'http://localhost:5000/api';

export async function getUsuarios() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/usuarios`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  if (!res.ok) throw new Error('Erro ao buscar usuários');
  return await res.json();
}

export async function createUsuario(usuario) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(usuario)
  });
  if (!res.ok) throw new Error('Erro ao criar usuário');
  return await res.json();
}

export async function updateUsuario(id, usuario) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/usuarios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(usuario)
  });
  if (!res.ok) throw new Error('Erro ao atualizar usuário');
  return await res.json();
}

export async function deleteUsuario(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/usuarios/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  if (!res.ok) throw new Error('Erro ao deletar usuário');
  return await res.json();
}
