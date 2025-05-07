import React from 'react';

const ProductCard = ({ produto, onAdd }) => (
  <div style={{border: '1px solid #eee', borderRadius: 4, padding: 12, margin: 8, width: 200}}>
    <img src={produto.imagem?.startsWith('http') ? produto.imagem : `http://localhost:5000${produto.imagem}`} alt={produto.nome} style={{width: '100%', height: 120, objectFit: 'cover'}} />
    <h4>{produto.nome}</h4>
    <div>R$ {produto.preco?.toFixed(2)}</div>
    <div>Estoque: {produto.estoque}</div>
    <button onClick={() => onAdd(produto)} disabled={produto.estoque <= 0}>Adicionar</button>
  </div>
);

export default ProductCard;
