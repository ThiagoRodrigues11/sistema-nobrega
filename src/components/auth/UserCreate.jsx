import React, { useState } from 'react';
import api from '../../api/auth';

export default function UserCreate() {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', role: 'user' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await api.createUser({ ...form, username: form.email });
      setSuccess('Usuário criado com sucesso!');
      setForm({ nome: '', email: '', senha: '', role: 'user' });
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar usuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth: 400, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8}}>
      <h2>Criar Novo Usuário</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome</label>
          <input name="nome" value={form.nome} onChange={handleChange} required />
        </div>
        <div>
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} type="email" required />
        </div>
        <div>
          <label>Senha</label>
          <input name="senha" value={form.senha} onChange={handleChange} type="password" required />
        </div>
        <div>
          <label>Tipo</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button type="submit" disabled={loading} style={{marginTop: 16}}>
          {loading ? 'Criando...' : 'Criar Usuário'}
        </button>
      </form>
      {success && <div style={{color: 'green', marginTop: 8}}>{success}</div>}
      {error && <div style={{color: 'red', marginTop: 8}}>{error}</div>}
    </div>
  );
}
