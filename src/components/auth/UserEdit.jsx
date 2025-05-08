import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/usuarios/${id}`, {
      headers: {
        'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
      }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao buscar usuário.');
        setLoading(false);
      });
  }, [id]);

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // Só envie a senha se o campo não estiver vazio
      const userToSend = { ...user };
      if (!userToSend.senha) delete userToSend.senha;
      const res = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        },
        body: JSON.stringify(userToSend)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao atualizar usuário.');
      setSuccess('Usuário atualizado com sucesso!');
      setTimeout(() => navigate('/usuarios'), 1200);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Usuário não encontrado.</div>;

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', background: '#fff', borderRadius: 8, padding: 24 }}>
      <h2>Editar Usuário</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Nome:</label>
          <input type="text" name="nome" value={user.nome || ''} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Email:</label>
          <input type="email" name="email" value={user.email || ''} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Username:</label>
          <input type="text" name="username" value={user.username || ''} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Nível de acesso:</label>
          <select name="nivel_acesso" value={user.nivel_acesso || ''} onChange={handleChange} required>
            <option value="admin">Admin</option>
            <option value="usuario">Usuário</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Nova senha:</label>
          <input type="password" name="senha" value={user.senha || ''} onChange={handleChange} placeholder="Deixe em branco para não alterar" />
        </div>
        <button type="submit">Salvar</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 12 }}>{success}</div>}
    </div>
  );
}

export default UserEdit;
