import React from 'react';

const CartItem = ({ item, onRemove, onQuantityChange }) => (
  <div style={{display: 'flex', alignItems: 'center', marginBottom: 8}}>
    <img src={item.imagem} alt={item.nome} style={{width: 40, marginRight: 8}} />
    <div style={{flex: 1}}>{item.nome}</div>
    <div>R$ {item.preco?.toFixed(2)}</div>
    <input type="number" min={1} max={item.estoque} value={item.quantidade} onChange={e => onQuantityChange(item.id, Number(e.target.value))} style={{width: 50, margin: '0 8px'}} />
    <button onClick={() => onRemove(item.id)}>Remover</button>
  </div>
);

export default CartItem;
