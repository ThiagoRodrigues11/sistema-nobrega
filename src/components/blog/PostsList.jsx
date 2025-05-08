import React, { useEffect, useState } from 'react';
import { getPosts } from '../../api/posts';
import { useNavigate } from 'react-router-dom';
import styles from './PostsList.module.css';

const resumo = (conteudo) => {
  if (!conteudo) return '';
  // Remove HTML tags and cut
  let text = conteudo.replace(/<[^>]+>/g, '');
  return text.length > 60 ? text.slice(0, 60) + '...' : text;
};

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getPosts().then(data => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Carregando posts...</div>;

  // Destaque o post mais recente (primeiro do array)
  const postDestaque = posts.length > 0 ? posts[0] : null;
  const outrosPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 style={{margin:0}}>Blog</h2>
      </div>
      {/* Botão flutuante fixo para criar post (apenas admin) */}
      {(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.nivel_acesso === 'admin') {
          return (
            <button className={styles.fabCreatePost} onClick={()=>navigate('/blog/novo')}>
              + Criar Post
            </button>
          );
        }
        return null;
      })()}

      {/* Post em destaque */}
      {postDestaque && (
        <div
          className={styles.featuredPost}
          style={{ cursor: 'pointer', position: 'relative', alignItems: 'center' }}
          onClick={() => navigate(`/blog/${postDestaque.id}`)}
          tabIndex={0}
          role="button"
          aria-label={`Abrir post: ${postDestaque.titulo}`}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/blog/${postDestaque.id}`); }}
        >
          <div style={{flex: '0 0 50%', width: '50%', height: '100%', background: '#fff', padding: 0, margin: 0, boxSizing: 'border-box', overflow: 'hidden'}}>
            <img
              className={styles.featuredImage}
              src={
                postDestaque.imagem
                  ? (
                      postDestaque.imagem.startsWith('/uploads')
                        ? (process.env.REACT_APP_API_URL
                            ? process.env.REACT_APP_API_URL.replace('/api','') + postDestaque.imagem
                            : 'http://localhost:5000' + postDestaque.imagem)
                        : (process.env.REACT_APP_API_URL
                            ? process.env.REACT_APP_API_URL.replace('/api','') + '/uploads/' + postDestaque.imagem
                            : 'http://localhost:5000/uploads/' + postDestaque.imagem)
                    )
                  : '/default-blog.png'
              }
              alt={postDestaque.titulo}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                minHeight: 220,
                minWidth: 0,
                maxWidth: '100%',
                maxHeight: '100%',
                background: '#fff',
                display: 'block',
                margin: 0,
                padding: 0,
                transition: 'transform 0.5s',
                borderRadius: 0
              }}
              draggable={false}
            />
          </div>
          <div className={styles.featuredContent} style={{flex: '1 1 50%', width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%'}}>
            <h1 className={styles.featuredTitle}>{postDestaque.titulo}</h1>
            <div className={styles.featuredResumo}>{resumo(postDestaque.conteudo, 260)}</div>
            <div className={styles.featuredMeta}>
              <span><b>{
                (postDestaque.autor_id && typeof postDestaque.autor_id === 'object' && postDestaque.autor_id.nome)
                || (typeof postDestaque.autor_id === 'string' ? postDestaque.autor_id : '')
                || (postDestaque.autor?.nome)
                || (postDestaque.usuario?.nome)
                || 'Autor'
              }</b></span>
              <span>
                • {postDestaque.created_at && !isNaN(new Date(postDestaque.created_at))
                  ? new Date(postDestaque.created_at).toLocaleDateString()
                  : ''}
              </span>
              <span>• {postDestaque.comentariosCount} Comentários</span>
            </div>
            {/* Botões de editar/apagar para o autor */}
            {(() => {
              const user = JSON.parse(localStorage.getItem('user'));
              const autorId = postDestaque.autor_id?._id || postDestaque.autor_id || postDestaque.usuario_id;
              if (user && (user.id === autorId || user._id === autorId)) {
                return (
                  <div style={{display:'flex', gap:12, marginTop:16, justifyContent:'center'}}>
                    <button className={styles.actionBtn} onClick={()=>navigate(`/blog/editar/${postDestaque.id}`)}>Editar</button>
                    <button className={styles.actionBtn} onClick={async ()=>{
                      if (!window.confirm('Tem certeza que deseja apagar este post?')) return;
                      try {
                        const { deletePost } = await import('../../api/posts');
                        await deletePost(postDestaque.id);
                        window.location.reload();
                      } catch (err) {
                        alert(err.message || 'Erro ao apagar post');
                      }
                    }}>Apagar</button>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>
      )}
      {/* Grid dos outros posts */}
      <div className={styles.postsGrid}>
        {outrosPosts.filter(post => post.id).map(post => {
          const user = JSON.parse(localStorage.getItem('user'));
          const autorId = post.autor_id?._id || post.autor_id || post.usuario_id;
          const isAuthor = user && (user.id === autorId || user._id === autorId);
          return (
            <div
              className={styles.card}
              key={post.id}
              style={{ cursor: 'pointer', position: 'relative' }}
              onClick={() => navigate(`/blog/${post.id}`)}
              tabIndex={0}
              role="button"
              aria-label={`Abrir post: ${post.titulo}`}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/blog/${post.id}`); }}
            >
              {post.categoria && (
                <span className={styles.cardBadge}>
                  {typeof post.categoria === 'string' ? post.categoria : post.categoria.nome}
                </span>
              )}
              <img
                className={styles.cardImage}
                src={
                  post.imagem
                    ? (
                        post.imagem.startsWith('/uploads')
                          ? (process.env.REACT_APP_API_URL
                              ? process.env.REACT_APP_API_URL.replace('/api','') + post.imagem
                              : 'http://localhost:5000' + post.imagem)
                          : (process.env.REACT_APP_API_URL
                              ? process.env.REACT_APP_API_URL.replace('/api','') + '/uploads/' + post.imagem
                              : 'http://localhost:5000/uploads/' + post.imagem)
                      )
                    : '/default-blog.png'
                }
                alt={post.titulo}
                style={{objectFit:'cover',height:180,width:'100%'}}
                draggable={false}
              />
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>{post.titulo}</div>
                <div className={styles.cardSummary}>{resumo(post.conteudo, 120)}</div>
                <div className={styles.cardMeta}>
                  <span className={styles.cardAuthor}>
                    {(typeof post.autor_id === 'object' && post.autor_id !== null && post.autor_id.nome)
                      ? post.autor_id.nome
                      : (typeof post.usuario === 'object' && post.usuario !== null && post.usuario.nome)
                        ? post.usuario.nome
                        : (typeof post.autor === 'object' && post.autor !== null && post.autor.nome)
                          ? post.autor.nome
                          : (typeof post.usuario === 'string' ? post.usuario
                            : (typeof post.autor === 'string' ? post.autor : 'Autor'))}
                  </span>
                  <span className={styles.cardDate}>
                    {post.created_at && !isNaN(new Date(post.created_at))
                      ? new Date(post.created_at).toLocaleDateString()
                      : 'Data inválida'}
                  </span>
                  <span className={styles.cardComments}>{post.comentariosCount} comentários</span>
                </div>
                {isAuthor && (
                  <div style={{display:'flex', gap:12, marginTop:12, justifyContent:'center'}}>
                    <button className={styles.actionBtn} onClick={e => {e.stopPropagation();navigate(`/blog/editar/${post.id}`);}}>Editar</button>
                    <button className={styles.actionBtn} onClick={async e => {
                      e.stopPropagation();
                      if (!window.confirm('Tem certeza que deseja apagar este post?')) return;
                      try {
                        const { deletePost } = await import('../../api/posts');
                        await deletePost(post.id);
                        window.location.reload();
                      } catch (err) {
                        alert(err.message || 'Erro ao apagar post');
                      }
                    }}>Apagar</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostsList;
