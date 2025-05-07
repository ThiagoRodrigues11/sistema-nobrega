import React, { useEffect, useState } from 'react';
import { getProducts } from '../../api/produtos';
import ProductCard from './ProductCard';
import Cart from './Cart';

const PdvPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(setProdutos).finally(() => setLoading(false));
  }, []);

  const addToCart = (produto) => {
    setCart(prev => {
      const found = prev.find(item => item.id === produto.id);
      if (found) {
        return prev.map(item => item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item);
      }
      return [...prev, { ...produto, quantidade: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  const changeQuantity = (id, quantidade) => setCart(prev => prev.map(item => item.id === id ? { ...item, quantidade } : item));
  const [msg, setMsg] = useState('');
  const checkout = async () => {
    setMsg('');
    try {
      // Aqui você pode ajustar para pegar o usuário do contexto de auth
      const usuario_id = 1; // ID do usuário logado, ajustar conforme fluxo de autenticação
      const itens = cart.map(item => ({
        produto_id: item.id,
        quantidade: item.quantidade,
        preco_unitario: item.preco
      }));
      const total = itens.reduce((sum, item) => sum + item.preco_unitario * item.quantidade, 0);
      await import('../../api/vendas').then(({ createSale }) => createSale({ usuario_id, total, status: 'concluida', itens }));
      setCart([]);
      setMsg('Venda registrada com sucesso!');
    } catch (err) {
      setMsg('Erro ao registrar venda. Faça login.');
    }
  };


  if (loading) return <div>Carregando catálogo...</div>;

  return (
    <div style={{display: 'flex', gap: 32}}>
      <div style={{flex: 2}}>
        <h2>Catálogo de Produtos</h2>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {produtos.map(produto => (
            <ProductCard key={produto.id} produto={produto} onAdd={addToCart} />
          ))}
        </div>
      </div>
      <div style={{flex: 1}}>
        <Cart items={cart} onRemove={removeFromCart} onQuantityChange={changeQuantity} onCheckout={checkout} />
      </div>
    </div>
  );
};

export default PdvPage;
