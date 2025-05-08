import React, { useEffect, useState } from 'react';
import { getCategoriasProduto, createCategoriaProduto, updateCategoriaProduto, deleteCategoriaProduto } from '../../api/categoriasProduto';
import styles from './CategoriasProdutosAdmin.module.css';

const CategoriasProdutosAdmin = () => {
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({ nome: '', descricao: '' });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchCategorias = () => getCategoriasProduto().then(setCategorias);
  useEffect(() => { fetchCategorias(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editId) {
        await updateCategoriaProduto(editId, form);
        setMsg('Categoria de produto atualizada!');
      } else {
        await createCategoriaProduto(form);
        setMsg('Categoria de produto criada!');
      }
      setForm({ nome: '', descricao: '' });
      setEditId(null);
      fetchCategorias();
    } catch (err) { setMsg('Erro ao salvar categoria de produto'); }
  };

  const handleEdit = cat => {
    setForm(cat);
    setEditId(cat._id);
  };
  const handleDelete = async id => {
    if (window.confirm('Remover categoria de produto?')) {
      await deleteCategoriaProduto(id);
      fetchCategorias();
    }
  };

  return (
    <div className={styles['categoria-container']}>
      <h2 className={styles['categoria-title']}>Gestão de Categorias de Produto</h2>
      <form onSubmit={handleSubmit} className={styles['categoria-form']}>
        <input required placeholder="Nome" value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))} />
        <textarea placeholder="Descrição" value={form.descricao} onChange={e=>setForm(f=>({...f,descricao:e.target.value}))} />
        <button type="submit">{editId ? 'Atualizar' : 'Criar'}</button>
        {editId && <button type="button" onClick={()=>{setEditId(null);setForm({ nome:'', descricao:'' });}}>Cancelar</button>}
      </form>
      {msg && <div className={styles['categoria-msg']}>{msg}</div>}
      <table className={styles['categoria-table']}>
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

export default CategoriasProdutosAdmin;
