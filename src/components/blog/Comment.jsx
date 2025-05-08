import React from 'react';

const Comment = ({ comentario }) => (
  <div style={{border: '1px solid #eee', padding: 10, marginBottom: 10, borderRadius: 4}}>
    <div style={{fontWeight: 'bold'}}>{comentario.usuario?.nome || 'Usuário'}</div>
    <div>{comentario.conteudo}</div>
    <div style={{fontSize: 12, color: '#888'}}>{new Date(comentario.created_at).toLocaleString()}</div>
  </div>
);

export default Comment;
