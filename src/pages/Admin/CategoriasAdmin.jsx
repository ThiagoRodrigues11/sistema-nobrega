import React, { useEffect, useState } from 'react';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../../api/categorias';

const CategoriasAdmin = () => {
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({ nome: '', descricao: '' });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchCategorias = () => getCategorias().then(setCategorias);
  useEffect(() => { fetchCategorias(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editId) {
        await updateCategoria(editId, form);
        setMsg('Categoria atualizada!');
      } else {
        await createCategoria(form);
        setMsg('Categoria criada!');
      }
      setForm({ nome: '', descricao: '' });
      setEditId(null);
      fetchCategorias();
    } catch (err) { setMsg('Erro ao salvar categoria'); }
  };

  const handleEdit = cat => {
    setForm(cat);
    setEditId(cat.id);
  };
  const handleDelete = async id => {
    if (window.confirm('Remover categoria?')) {
      await deleteCategoria(id);
      fetchCategorias();
    }
  };

  return (
    <div>
      <h2>Gestão de Categorias</h2>
      <form onSubmit={handleSubmit} style={{marginBottom:20}}>
        <input required placeholder="Nome" value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))} />
        <textarea placeholder="Descrição" value={form.descricao} onChange={e=>setForm(f=>({...f,descricao:e.target.value}))} />
        <button type="submit">{editId ? 'Atualizar' : 'Criar'}</button>
        {editId && <button type="button" onClick={()=>{setEditId(null);setForm({ nome:'', descricao:'' });}}>Cancelar</button>}
      </form>
      {msg && <div>{msg}</div>}
      <table border="1" cellPadding="6">
        <thead><tr><th>ID</th><th>Nome</th><th>Ações</th></tr></thead>
        <tbody>
          {categorias.map(cat=>(
            <tr key={cat._id}>
              <td>{cat._id}</td><td>{cat.nome}</td>
              <td>
                <button onClick={()=>handleEdit(cat)}>Editar</button>
                <button onClick={()=>handleDelete(cat._id)}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriasAdmin;
