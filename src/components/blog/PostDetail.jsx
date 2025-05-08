import React, { useState, useEffect } from 'react';
import { getPostById, deletePost } from '../../api/posts';
import CommentForm from './CommentForm';
import CommentThread from './CommentThread';
import { useParams, useNavigate } from 'react-router-dom';

const PostDetail = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPostById(id)
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        setPost(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Carregando post...</div>;
  if (!post) return <div>Post não encontrado.</div>;

  // Função para extrair o ID do YouTube
  const getYoutubeId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube(?:-nocookie)?.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([\w-]{11})/
    );
    return match ? match[1] : null;
  };
  const youtubeId = getYoutubeId(post.youtube);


  // Monta src da imagem
  const getImageSrc = (img) => {
    if (!img) return '/default-blog.png';
    // Se já vier com /uploads
    if (img.startsWith('/uploads')) {
      return (process.env.REACT_APP_API_URL
        ? process.env.REACT_APP_API_URL.replace('/api','') + img
        : 'http://localhost:5000' + img);
    }
    // Se vier só o nome do arquivo
    return (process.env.REACT_APP_API_URL
      ? process.env.REACT_APP_API_URL.replace('/api','') + '/uploads/' + img
      : 'http://localhost:5000/uploads/' + img);
  };


  // Monta src do PDF
  const getPdfSrc = (pdf) => {
    if (!pdf) return '';
    if (pdf.startsWith('/uploads')) {
      return (process.env.REACT_APP_API_URL
        ? process.env.REACT_APP_API_URL.replace('/api','') + pdf
        : 'http://localhost:5000' + pdf);
    }
    return (process.env.REACT_APP_API_URL
      ? process.env.REACT_APP_API_URL.replace('/api','') + '/uploads/' + pdf
      : 'http://localhost:5000/uploads/' + pdf);
  };

  // Monta src do vídeo
  const getVideoSrc = (video) => {
    if (!video) return '';
    if (video.startsWith('/uploads')) {
      return (process.env.REACT_APP_API_URL
        ? process.env.REACT_APP_API_URL.replace('/api','') + video
        : 'http://localhost:5000' + video);
    }
    return (process.env.REACT_APP_API_URL
      ? process.env.REACT_APP_API_URL.replace('/api','') + '/uploads/' + video
      : 'http://localhost:5000/uploads/' + video);
  };

  async function handleDeletePost() {
    if (!window.confirm('Tem certeza que deseja apagar este post?')) return;
    try {
      await deletePost(post._id);
      navigate('/blog');
    } catch (err) {
      alert(err.message || 'Erro ao apagar post');
    }
  }

  return (
    <div style={{
      maxWidth: 900,
      margin: '48px auto',
      background: 'linear-gradient(120deg, #f8fafc 60%, #f3e8ff 100%)',
      borderRadius: 22,
      boxShadow: '0 8px 32px #0002',
      padding: '46px 32px 38px 32px',
      position: 'relative',
      minHeight: 600
    }}>
      <button onClick={() => navigate(-1)} style={{
        position: 'absolute', left: 38, top: 38, background: 'none', border: 'none', color: '#6c63ff', fontWeight: 700, fontSize: 18, cursor: 'pointer', letterSpacing: 0.2
      }}>&larr; Voltar</button>
      {(usuario && (usuario.nivel_acesso === 'admin' || (post.autor_id && (usuario._id === post.autor_id._id || usuario.id === post.autor_id._id)))) && (
        <button onClick={handleDeletePost} style={{
          position: 'absolute', right: 38, top: 38, background:'#ff5252', color:'#fff', border:'none', borderRadius:10, padding:'10px 22px', fontWeight:700, fontSize:16, cursor:'pointer', boxShadow: '0 2px 8px #0001', transition: 'background .2s',
        }}>Apagar post</button>
      )}
      <div style={{marginTop: 38}}>
        <h1 style={{fontSize: '2.8rem', fontWeight: 800, marginBottom: 14, color: '#22223b', letterSpacing: -1}}>{post.titulo}</h1>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18, flexWrap:'wrap'}}>
          <span style={{color: '#6c63ff', fontWeight: 600, fontSize:17, background:'#f3e8ff', borderRadius:8, padding:'4px 14px'}}>
            {(typeof post.usuario === 'object' && post.usuario !== null && post.usuario.nome) ? post.usuario.nome : (typeof post.autor === 'object' && post.autor !== null && post.autor.nome) ? post.autor.nome : (typeof post.usuario === 'string' ? post.usuario : (typeof post.autor === 'string' ? post.autor : 'Autor'))}
          </span>
          <span style={{color: '#888', fontSize: 15, background:'#e0e7ef', borderRadius:8, padding:'4px 10px', fontWeight:500}}>
            {post.created_at && (new Date(post.created_at).toLocaleString())}
          </span>
          {post.categoria && (
            <span style={{background: 'linear-gradient(90deg,#ffb300 60%,#ffb347 100%)', color: '#fff', borderRadius: 16, padding: '6px 22px', fontWeight: 700, fontSize: 16, marginLeft: 8, boxShadow: '0 1px 4px #ffb30022'}}>
              {typeof post.categoria === 'string' ? post.categoria : post.categoria.nome}
            </span>
          )}
        </div>
        <div style={{ marginBottom: 24 }}>
          <img
            src={getImageSrc(post.imagem)}
            alt={post.titulo}
            style={{ maxWidth: '100%', borderRadius: 8 }}
          />
        </div>
        {youtubeId && (
          <div style={{ margin: '24px 0', textAlign: 'center' }}>
            <iframe
              width="100%"
              height="360"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title="YouTube player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: 12, maxWidth: 600 }}
            ></iframe>
          </div>
        )}
        {post.pdf && (
          <a
            href={getPdfSrc(post.pdf)}
            target="_blank"
            rel="noopener noreferrer"
            style={{display:'inline-block',margin:'22px 0 18px 0',color:'#6c63ff',fontWeight:700,fontSize:20,textDecoration:'none',background:'#f3e8ff',padding:'10px 22px',borderRadius:10,transition:'background .2s'}}
          >
            <span role="img" aria-label="PDF" style={{marginRight:8}}>📄</span> Baixar PDF
          </a>
        )}
        {post.video && (
          <video
            controls
            width="100%"
            style={{display:'block',margin:'20px 0',borderRadius:16,background:'#000',maxWidth:700,boxShadow:'0 4px 16px #0002'}}
          >
            <source
              src={getVideoSrc(post.video)}
            />
            Seu navegador não suporta vídeo.
          </video>
        )}
        <div style={{fontSize: '1.22rem', color: '#333', marginBottom: 38, lineHeight: 1.7, background:'#fff', borderRadius:12, padding:'18px 22px', boxShadow:'0 2px 8px #0001'}} dangerouslySetInnerHTML={{ __html: post.conteudo }} />
      </div>
      <div style={{marginTop: 48, background: 'linear-gradient(120deg,#fafbfc 60%,#f3e8ff 100%)', borderRadius: 14, padding: 32, boxShadow:'0 2px 8px #0001'}}>
        <h2 style={{fontSize: '1.45rem', marginBottom: 20, color: '#222', fontWeight:800}}>Comentários</h2>
        <CommentForm postId={post._id} onCommentPosted={() => getPostById(id).then(setPost)} />
        <CommentThread comentarios={post.comentarios || []} postId={post._id} onCommentPosted={() => getPostById(id).then(setPost)} />
      </div>
    </div>
  );
};

export default PostDetail;
