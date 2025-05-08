import React from 'react';
import CartItem from './CartItem';

const Cart = ({ items, onRemove, onQuantityChange, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
  return (
    <div style={{border: '1px solid #ddd', borderRadius: 4, padding: 16, minWidth: 320}}>
      <h3>Carrinho</h3>
      {items.length === 0 ? (
        <div>O carrinho está vazio.</div>
      ) : (
        <>
          {items.map(item => (
            <CartItem key={item.id} item={item} onRemove={onRemove} onQuantityChange={onQuantityChange} />
          ))}
          <div style={{marginTop: 12, fontWeight: 'bold'}}>Total: R$ {total.toFixed(2)}</div>
          <button onClick={onCheckout} style={{marginTop: 10}}>Finalizar Venda</button>
        </>
      )}
    </div>
  );
};

export default Cart;
