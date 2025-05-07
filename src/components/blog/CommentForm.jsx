import React, { useState } from 'react';
import { postComment } from '../../api/posts';
import { useAuth } from '../auth/AuthProvider';
import styles from './CommentForm.module.css';

const CommentForm = ({ postId, parentId, onCommentPosted }) => {
  const [conteudo, setConteudo] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      if (!user) throw new Error('Usuário não autenticado');
      await postComment(postId, conteudo, parentId, user.id || user._id);
      setConteudo('');
      setMsg('Comentário enviado!');
      onCommentPosted && onCommentPosted();
    } catch (err) {
      setMsg('Erro ao comentar. Faça login.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.commentFormContainer}>
      <form onSubmit={handleSubmit}>
        <textarea
          className={styles.textarea}
          value={conteudo}
          onChange={e => setConteudo(e.target.value)}
          required
          rows={3}
          placeholder="Escreva um comentário..."
        />
        <button
          className={styles.button}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Comentar'}
        </button>
        {msg && <div className={styles.msg}>{msg}</div>}
      </form>
    </div>
  );
};

export default CommentForm;
