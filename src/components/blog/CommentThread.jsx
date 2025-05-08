import React, { useState } from 'react';
import CommentForm from './CommentForm';
import { useAuth } from '../auth/AuthProvider';
import { deleteComment } from '../../api/posts';
import styles from './CommentForm.module.css';

// Função recursiva para montar árvore de comentários
function buildTree(comentarios, parentId = null) {
  // Filtra filhos deste parentId
  const filhos = comentarios
    .filter(c => (
      (c.resposta_a && parentId && String(c.resposta_a) === String(parentId)) ||
      (!c.resposta_a && !parentId)
    ));
  // Ordena filhos: replies sempre do mais antigo para o mais novo
  const filhosOrdenados = filhos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  // Fallback: se não houver filhos e é o nível 0, retorna todos como raiz
  if (filhosOrdenados.length === 0 && parentId === null) {
    return comentarios.map(c => ({
      ...c,
      replies: []
    }));
  }
  return filhosOrdenados.map(c => ({
    ...c,
    replies: buildTree(comentarios, c._id || c.id)
  }));
}

const CommentThread = ({ comentarios, postId, onCommentPosted, parentId = null, nivel = 0 }) => {
  if (nivel === 0) {
    console.log('DEBUG: Comentários recebidos no CommentThread:', comentarios);
  }

  const [replyingTo, setReplyingTo] = useState(null);
  const { user } = useAuth();
  // Ordena os comentários mais recentes primeiro
  const comentariosOrdenados = [...comentarios].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const tree = buildTree(comentariosOrdenados, parentId);
  if (nivel === 0) {
    console.log('DEBUG: Árvore de comentários montada:', tree);
  }

  const handleDelete = async (comentarioId) => {
    if (!window.confirm('Tem certeza que deseja apagar este comentário?')) return;
    try {
      await deleteComment(comentarioId, user.id || user._id);
      onCommentPosted && onCommentPosted();
    } catch (err) {
      alert('Erro ao apagar comentário.');
    }
  };

  return (
    <div>
      {tree.map(comentario => (
        <div key={comentario._id || comentario.id} style={{
          marginLeft: nivel > 0 ? 28 : 0,
          borderLeft: nivel > 0 ? '2px solid #bcbcff' : 'none',
          paddingLeft: nivel > 0 ? 12 : 0,
          marginTop: 12,
          marginBottom: 8
        }}>
          <div style={{fontWeight: 'bold', color: '#6c63ff'}}>{comentario.usuario?.nome || comentario.usuario_id?.nome || comentario.usuario_id || comentario.usuario || 'Usuário'}</div>
          <div style={{margin: '6px 0 2px 0'}}>{comentario.conteudo}</div>
          <div style={{fontSize: 12, color: '#888'}}>{comentario.created_at && new Date(comentario.created_at).toLocaleString()}</div>
          <button style={{background: 'none', border: 'none', color: '#574fd6', fontSize: 13, marginTop: 4, cursor: 'pointer'}} onClick={() => setReplyingTo(replyingTo === comentario._id ? null : comentario._id)}>Responder</button>
          {user && (comentario.usuario_id?._id === user.id || comentario.usuario_id === user.id || comentario.usuario_id === user._id) && (
            <button style={{background: 'none', border: 'none', color: '#c62828', fontSize: 13, marginLeft: 8, cursor: 'pointer'}} onClick={() => handleDelete(comentario._id || comentario.id)}>Apagar</button>
          )}
          {replyingTo === comentario._id && (
            <div className={styles.replyBox}>
              <CommentForm postId={postId} parentId={comentario._id || comentario.id} onCommentPosted={() => { setReplyingTo(null); onCommentPosted && onCommentPosted(); }} />
            </div>
          )}
          {comentario.replies && comentario.replies.length > 0 && (
            <CommentThread comentarios={comentario.replies} postId={postId} onCommentPosted={onCommentPosted} nivel={nivel + 1} />
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentThread;
