import React, { useEffect, useState } from 'react';
import styles from './ProdutosAdmin.module.css';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/produtos';
import { getCategoriasProduto } from '../../api/categoriasProduto';
import { uploadImagem } from '../../api/upload';

const ProdutosAdmin = () => {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({ nome: '', preco: '', estoque: '', categoria_produto_id: '', descricao: '', imagem: '' });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchProdutos = () => getProducts().then(setProdutos);
  const fetchCategorias = () => getCategoriasProduto().then(setCategorias);

  useEffect(() => {
    fetchProdutos();
    fetchCategorias();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editId) {
        await updateProduct(editId, form);
        setMsg('Produto atualizado!');
      } else {
        await createProduct(form);
        setMsg('Produto criado!');
      }
      setForm({ nome: '', preco: '', estoque: '', categoria_produto_id: '', descricao: '', imagem: '' });
      setEditId(null);
      fetchProdutos();
    } catch (err) { setMsg('Erro ao salvar produto'); }
  };

  const handleEdit = prod => {
    setForm({
      ...prod,
      categoria_produto_id: prod.categoria_produto_id || '',
    });
    setEditId(prod.id);
  };
  const handleDelete = async id => {
    if (window.confirm('Remover produto?')) {
      await deleteProduct(id);
      fetchProdutos();
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h2 className={styles.adminTitle}>Gestão de Produtos</h2>
      <form onSubmit={handleSubmit} className={styles.prodForm}>
        <input required placeholder="Nome" value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))} />
        <input required placeholder="Preço" type="number" value={form.preco} onChange={e=>setForm(f=>({...f,preco:e.target.value}))} />
        <input required placeholder="Estoque" type="number" value={form.estoque} onChange={e=>setForm(f=>({...f,estoque:e.target.value}))} />
        <select required value={form.categoria_produto_id} onChange={e=>setForm(f=>({...f,categoria_produto_id:Number(e.target.value)}))}>
          <option value="">Selecione a categoria</option>
          {categorias.map(cat => (
            <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.nome}</option>
          ))}
        </select>
        <input type="file" accept="image/*" onChange={async e => {
          const file = e.target.files[0];
          if (file) {
            try {
              const res = await uploadImagem(file);
              setForm(f => ({ ...f, imagem: res.path }));
            } catch (err) {
              setMsg('Erro ao fazer upload da imagem');
            }
          }
        }} />
        {form.imagem && (
          <img src={form.imagem} alt="Preview" style={{ maxWidth: 90, maxHeight: 60, borderRadius: 6, marginLeft: 8 }} />
        )}
        <textarea placeholder="Descrição" value={form.descricao} onChange={e=>setForm(f=>({...f,descricao:e.target.value}))} />
        <button type="submit">{editId ? 'Atualizar' : 'Criar'}</button>
        {editId && <button type="button" onClick={()=>{setEditId(null);setForm({ nome:'', preco:'', estoque:'', categoria_produto_id:'', descricao:'', imagem:'' });}}>Cancelar</button>}
      </form>
      {msg && <div className={styles.msg}>{msg}</div>}
      <table className={styles.prodTable}>
        <thead><tr><th>ID</th><th>Nome</th><th>Preço</th><th>Estoque</th><th>Ações</th></tr></thead>
        <tbody>
          {produtos.map(prod=>(
            <tr key={prod.id}>
              <td>{prod.id}</td><td>{prod.nome}</td><td>{prod.preco}</td><td>{prod.estoque}</td>
              <td>
                <button className={styles.editBtn} onClick={()=>handleEdit(prod)}>Editar</button>
                <button onClick={()=>handleDelete(prod.id)}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProdutosAdmin;
