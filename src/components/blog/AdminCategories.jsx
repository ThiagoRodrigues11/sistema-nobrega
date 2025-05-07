import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Componente de gerenciamento de categorias (apenas para admins)
const AdminCategories = () => {
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [editando, setEditando] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [msg, setMsg] = useState('');

  // Busca categorias
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/categorias`)
      .then(res => setCategorias(res.data))
      .catch(() => setCategorias([]));
  }, []);

  // Adiciona categoria
  const adicionar = async () => {
    if (!novaCategoria.trim()) return;
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/categorias`, { nome: novaCategoria });
      setCategorias([...categorias, res.data]);
      setNovaCategoria('');
      setMsg('Categoria criada!');
    } catch (err) {
      setMsg('Erro ao criar categoria');
    }
  };

  // Editar categoria
  const salvarEdicao = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/categorias/${id}`, { nome: editNome });
      setCategorias(categorias.map(cat => cat._id === id ? { ...cat, nome: editNome } : cat));
      setEditando(null);
      setMsg('Categoria editada!');
    } catch {
      setMsg('Erro ao editar');
    }
  };

  // Excluir categoria
  const excluir = async (id) => {
    if (!window.confirm('Excluir categoria?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/categorias/${id}`);
      setCategorias(categorias.filter(cat => cat._id !== id));
      setMsg('Categoria excluída!');
    } catch {
      setMsg('Erro ao excluir');
    }
  };

  return (
    <div style={{maxWidth:500,margin:'40px auto',background:'#fff',padding:24,borderRadius:12,boxShadow:'0 2px 16px #0001'}}>
      <h2>Gerenciar Categorias</h2>
      {msg && <div style={{color:'#6c63ff',marginBottom:10}}>{msg}</div>}
      <div style={{display:'flex',gap:8,marginBottom:20}}>
        <input value={novaCategoria} onChange={e=>setNovaCategoria(e.target.value)} placeholder="Nova categoria" style={{flex:1,padding:8}} />
        <button onClick={adicionar} style={{padding:'8px 16px',background:'#6c63ff',color:'#fff',border:'none',borderRadius:6}}>Adicionar</button>
      </div>
      <ul style={{listStyle:'none',padding:0}}>
        {categorias.map(cat => (
          <li key={cat._id} style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
            {editando===cat._id ? (
              <>
                <input value={editNome} onChange={e=>setEditNome(e.target.value)} style={{flex:1,padding:6}} />
                <button onClick={()=>salvarEdicao(cat._id)} style={{padding:'6px 14px',background:'#6c63ff',color:'#fff',border:'none',borderRadius:5}}>Salvar</button>
                <button onClick={()=>{setEditando(null);setEditNome('')}} style={{padding:'6px 10px'}}>Cancelar</button>
              </>
            ) : (
              <>
                <span style={{flex:1}}>{cat.nome}</span>
                <button onClick={()=>{setEditando(cat._id);setEditNome(cat.nome);}} style={{padding:'6px 14px'}}>Editar</button>
                <button onClick={()=>excluir(cat._id)} style={{padding:'6px 10px',color:'#e63946'}}>Excluir</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCategories;
