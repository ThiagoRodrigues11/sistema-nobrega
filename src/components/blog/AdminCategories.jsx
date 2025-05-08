import React, { useState, useEffect } from 'react';
import { get, post, put, del } from '@api/api';

const AdminCategories = () => {
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [editNome, setEditNome] = useState('');
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await get('/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await post('/categorias', { nome: novaCategoria });
      setCategorias([...categorias, response.data]);
      setNovaCategoria('');
      setMsg('Categoria criada!');
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      setMsg('Erro ao criar categoria');
    }
  };

  const handleEditCategory = async (id, nome) => {
    setEditNome(nome);
    setEditId(id);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      await put(`/categorias/${editId}`, { nome: editNome });
      const updatedCategorias = categorias.map(cat => 
        cat._id === editId ? { ...cat, nome: editNome } : cat
      );
      setCategorias(updatedCategorias);
      setEditId(null);
      setEditNome('');
      setMsg('Categoria editada!');
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      setMsg('Erro ao editar');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await del(`/categorias/${id}`);
        const updatedCategorias = categorias.filter(cat => cat._id !== id);
        setCategorias(updatedCategorias);
        setMsg('Categoria excluída!');
      } catch (error) {
        console.error('Erro ao excluir categoria:', error);
        setMsg('Erro ao excluir');
      }
    }
  };

  return (
    <div style={{maxWidth:500,margin:'40px auto',background:'#fff',padding:24,borderRadius:12,boxShadow:'0 2px 16px #0001'}}>
      <h2>Gerenciar Categorias</h2>
      {msg && <div style={{color:'#6c63ff',marginBottom:10}}>{msg}</div>}
      <div style={{display:'flex',gap:8,marginBottom:20}}>
        <input value={novaCategoria} onChange={e=>setNovaCategoria(e.target.value)} placeholder="Nova categoria" style={{flex:1,padding:8}} />
        <button onClick={handleAddCategory} style={{padding:'8px 16px',background:'#6c63ff',color:'#fff',border:'none',borderRadius:6}}>Adicionar</button>
      </div>
      <ul style={{listStyle:'none',padding:0}}>
        {categorias.map(cat => (
          <li key={cat._id} style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
            {editId===cat._id ? (
              <form onSubmit={handleUpdateCategory}>
                <input value={editNome} onChange={e=>setEditNome(e.target.value)} style={{flex:1,padding:6}} />
                <button type="submit" style={{padding:'6px 14px',background:'#6c63ff',color:'#fff',border:'none',borderRadius:5}}>Salvar</button>
                <button onClick={() => { setEditId(null); setEditNome(''); }} style={{padding:'6px 10px'}}>Cancelar</button>
              </form>
            ) : (
              <>
                <span style={{flex:1}}>{cat.nome}</span>
                <button onClick={() => handleEditCategory(cat._id, cat.nome)} style={{padding:'6px 14px'}}>Editar</button>
                <button onClick={() => handleDeleteCategory(cat._id)} style={{padding:'6px 10px',color:'#e63946'}}>Excluir</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCategories;
