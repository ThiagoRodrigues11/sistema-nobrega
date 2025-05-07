const API_URL = 'http://localhost:5000/api';

export async function uploadImagem(file) {
  const formData = new FormData();
  formData.append('file', file);
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: formData
  });
  if (!res.ok) throw new Error('Erro ao fazer upload da imagem');
  return await res.json(); // { url: '/uploads/xxxx.png' }
}
