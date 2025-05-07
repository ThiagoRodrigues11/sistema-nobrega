import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategorias } from '../../api/categorias';

import styles from './PostForm.module.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function PostForm({ editMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    titulo: '',
    conteudo: '',
    imagem: '', // will hold the uploaded image URL
    categoria: '', // will hold the selected category id
    youtube: '' // novo campo para link do YouTube
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [imagemFile, setImagemFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    getCategorias().then(setCategorias).catch(() => setCategorias([]));
  }, []);

  // If editing, fetch post data
  useEffect(() => {
    if (editMode && id) {
      setLoading(true);
      fetch(`${API_URL}/posts/${id}`)
        .then(res => res.json())
        .then(data => {
          setForm({
            titulo: data.titulo || '',
            conteudo: data.conteudo || '',
            imagem: data.imagem || '',
            categoria: typeof data.categoria === 'object' && data.categoria !== null ? data.categoria._id : data.categoria || '',
            youtube: data.youtube || ''
          });
        })
        .catch(() => setErro('Erro ao carregar post'))
        .finally(() => setLoading(false));
    }
  }, [editMode, id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      setImagemFile(e.target.files[0]);
    }
  };

  const handlePdfChange = e => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleVideoChange = e => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      let imageUrl = form.imagem;
      let pdfUrl = form.pdf;
      let videoUrl = form.video;
      // Upload imagem
      if (imagemFile) {
        const formData = new FormData();
        formData.append('file', imagemFile);
        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!uploadRes.ok) throw new Error('Erro ao enviar imagem');
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.filename ? uploadData.filename : (uploadData.path ? uploadData.path.replace('/uploads/', '') : '');
      }
      // Upload PDF
      if (pdfFile) {
        const formData = new FormData();
        formData.append('file', pdfFile);
        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!uploadRes.ok) throw new Error('Erro ao enviar PDF');
        const uploadData = await uploadRes.json();
        pdfUrl = uploadData.filename ? uploadData.filename : (uploadData.path ? uploadData.path.replace('/uploads/', '') : '');
      }
      // Upload vídeo
      if (videoFile) {
        const formData = new FormData();
        formData.append('file', videoFile);
        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!uploadRes.ok) throw new Error('Erro ao enviar vídeo');
        const uploadData = await uploadRes.json();
        videoUrl = uploadData.filename ? uploadData.filename : (uploadData.path ? uploadData.path.replace('/uploads/', '') : '');
      }
      let method = 'POST';
      let url = `${API_URL}/posts`;
      if (editMode && id) {
        method = 'PUT';
        url = `${API_URL}/posts/${id}`;
      }
      const postBody = {
        ...form,
        imagem: imageUrl,
        pdf: pdfUrl,
        video: videoUrl,

        categoria: typeof form.categoria === 'object' && form.categoria !== null ? form.categoria._id : form.categoria
      };
      console.log('postBody', postBody);
      const token = localStorage.getItem('token');
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(postBody)
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.log('Erro do backend:', errorText);
        throw new Error('Erro ao salvar post');
      }
      navigate('/blog');
    } catch (err) {
      setErro('Erro ao salvar post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>{editMode ? 'Editar Post' : 'Criar Post'}</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="titulo">Título</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="conteudo">Conteúdo</label>
          <textarea
            id="conteudo"
            name="conteudo"
            value={form.conteudo}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Digite o conteúdo do post"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="imagem">Imagem</label>
          <input
            type="file"
            id="imagem"
            accept="image/*"
            onChange={handleImageChange}
          />
          {form.imagem && (
            <img
              src={form.imagem.startsWith('http') ? form.imagem : `${API_URL}/uploads/${form.imagem}`}
              alt="Prévia"
              style={{ maxWidth: '200px', margin: '10px 0', borderRadius: 8, border: '1px solid #eee' }}
            />
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="pdf">PDF</label>
          <input
            type="file"
            id="pdf"
            accept="application/pdf"
            onChange={handlePdfChange}
          />
          {form.pdf && (
            <a href={form.pdf.startsWith('http') ? form.pdf : `${API_URL}/uploads/${form.pdf}`} target="_blank" rel="noopener noreferrer" style={{display:'block',margin:'10px 0',color:'#6c63ff'}}>
              📄 Baixar PDF
            </a>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="video">Vídeo</label>
          <input
            type="file"
            id="video"
            accept="video/mp4,video/quicktime,video/x-matroska"
            onChange={handleVideoChange}
          />
          {form.video && (
            <video controls width="320" style={{display:'block',margin:'10px 0'}}>
              <source src={form.video.startsWith('http') ? form.video : `${API_URL}/uploads/${form.video}`} />
              Seu navegador não suporta vídeo.
            </video>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="youtube">Link do YouTube (opcional)</label>
          <input
            id="youtube"
            name="youtube"
            type="url"
            placeholder="Cole o link do vídeo do YouTube aqui"
            value={form.youtube}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="categoria">Categoria</label>
          <select
            id="categoria"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.nome}</option>
            ))}
          </select>
        </div>
        <div className={styles.actions}>
          <button type="submit" disabled={loading}>{editMode ? 'Salvar' : 'Criar'}</button>
          <button type="button" onClick={()=>navigate(-1)}>Cancelar</button>
        </div>
        {erro && <div className={styles.error}>{erro}</div>}
      </form>
    </div>
  );
};

export default PostForm;
