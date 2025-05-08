import React, { useState, useEffect } from 'react';
import { get, post } from '../api/api.js';
import PersonalizationModal from '../components/pdv/PersonalizationModal';
import styles from '../components/pdv/PDV.module.css';
import { useNavigate } from 'react-router-dom';

const PDV = () => {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [carrinho, setCarrinho] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [produtoPersonalizar, setProdutoPersonalizar] = useState(null);
  const [desconto, setDesconto] = useState(0);
  const [pagamento, setPagamento] = useState('dinheiro');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('useEffect do PDV rodou');
    get('/produtos')
      .then(response => {
        console.log('Resposta do backend no PDV:', response.data);
        if (Array.isArray(response.data)) {
          console.log('Produtos recebidos no PDV:', response.data);
          setProdutos(response.data);
        } else if (response.data && Array.isArray(response.data.produtos)) {
          console.log('Produtos recebidos no PDV:', response.data.produtos);
          setProdutos(response.data.produtos);
        } else {
          setProdutos([]);
        }
      })
      .catch((err) => {
        console.log('Erro ao buscar produtos:', err);
        setProdutos([]);
      });
  }, []);

  const produtosFiltrados = Array.isArray(produtos) ? produtos.filter(p =>
    (p.nome || '').toLowerCase().includes(busca.toLowerCase()) ||
    ((p.categoria_produto?.nome || '').toLowerCase().includes(busca.toLowerCase()))
  ) : [];

  console.log('Produtos filtrados no PDV:', produtosFiltrados);

  const adicionarAoCarrinho = (produto) => {
    if (produto.nome.toLowerCase().includes('camisa')) {
      setProdutoPersonalizar(produto);
      setModalOpen(true);
      return;
    }
    setCarrinho(prev => {
      const idx = prev.findIndex(i => i.id === produto.id);
      if (idx !== -1) {
        const novo = [...prev];
        novo[idx].qtd += 1;
        return novo;
      }
      return [...prev, { ...produto, preco: Number(produto.preco), qtd: 1, adicionais: [] }];
    });
  };

  const finalizarPersonalizacao = (personalizado, adicionais, valorExtra) => {
    setCarrinho(prev => [
      ...prev,
      {
        ...personalizado,
        preco: Number(personalizado.preco) + Number(valorExtra),
        qtd: 1,
        adicionais
      }
    ]);
    setModalOpen(false);
    setProdutoPersonalizar(null);
  };

  const removerDoCarrinho = (id) => {
    setCarrinho(prev => prev.filter(item => item.id !== id));
  };

  const alterarQtd = (id, qtd) => {
    setCarrinho(prev => prev.map(item => item.id === id ? { ...item, qtd: qtd } : item));
  };

  const calcularTotal = () => {
    const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.qtd), 0);
    return Math.max(0, subtotal - desconto);
  };

  const finalizarVenda = () => {
    if (carrinho.length === 0) return alert('Adicione produtos ao carrinho!');
    
    // Formatar os itens do carrinho para o formato esperado pelo backend
    const itensFormatados = carrinho.map(item => ({
      produtoId: item.id,
      quantidade: item.qtd,
      precoUnitario: item.preco,
      subtotal: item.preco * item.qtd
    }));

    post('/vendas', {
      itens: itensFormatados,
      desconto: Number(desconto),
      formaPagamento: pagamento,
      total: calcularTotal(),
      status: 'concluida'
    }).then(() => {
      navigate('/vendas');
    }).catch((error) => {
      console.error('Erro ao finalizar venda:', error);
      alert('Erro ao finalizar venda. Verifique o console para mais detalhes.');
    });
  };

  return (
    <div className={styles.pdvContainer}>
      <div className={styles.pdvHeader}>
        <h1><i className="fas fa-cash-register"></i> Ponto de Venda</h1>
      </div>
      <div className={styles.pdvGrid}>
        {/* Produtos */}
        <div className={styles.produtosSection}>
          <div className={styles.cardProdutos}>
            <div className={styles.cardHeaderProdutos}>
              <h5><i className="fas fa-boxes"></i> Produtos</h5>
              <div className={styles.searchContainer}>
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Buscar produto..." value={busca} onChange={e => setBusca(e.target.value)} />
              </div>
            </div>
            <div className={styles.cardBodyProdutos}>
              {produtosFiltrados.length === 0 ? (
                <div className="text-center py-5">Nenhum produto disponível</div>
              ) : (
                <div className={styles.listaProdutos}>
                  {produtosFiltrados.map(produto => (
                    <div className={styles.produtoCard} key={produto.id}>
                      {produto.imagem && <img src={produto.imagem} alt={produto.nome} className={styles.produtoImagem} />}
                      <div className={styles.produtoInfo}>
                        <h6>{produto.nome}</h6>
                        <p>{produto.categoria_produto?.nome}</p>
                        <div>R$ {produto.preco}</div>
                        <div>Estoque: {produto.estoque}</div>
                        <button onClick={() => adicionarAoCarrinho(produto)}>
                          <i className="fas fa-plus"></i> Adicionar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Carrinho */}
        <div className={styles.carrinhoSection}>
          <div className={styles.carrinhoContainer}>
            <div className={styles.carrinhoHeader}>
              <h5><i className="fas fa-shopping-cart"></i> Carrinho</h5>
            </div>
            <div className={styles.carrinhoBody}>
              <table className={styles.carrinhoTable}>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd</th>
                    <th>Preço</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {carrinho.map(item => (
                    <tr key={item.id}>
                      <td>{item.nome}</td>
                      <td>
                        <input type="number" min="1" value={item.qtd} onChange={e => alterarQtd(item.id, Number(e.target.value))} />
                      </td>
                      <td>R$ {item.preco.toFixed(2)}</td>
                      <td>R$ {(item.preco * item.qtd).toFixed(2)}</td>
                      <td>
                        <button className={styles.btnRemover} onClick={() => removerDoCarrinho(item.id)} title="Remover do carrinho">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.carrinhoFooter}>
              <div>
                <label>Desconto (R$)</label>
                <input type="number" min="0" step="0.01" value={desconto} onChange={e => setDesconto(Number(e.target.value))} />
              </div>
              <div>
                <label>Forma de Pagamento</label>
                <select value={pagamento} onChange={e => setPagamento(e.target.value)}>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao_debito">Cartão Débito</option>
                  <option value="cartao_credito">Cartão Crédito</option>
                  <option value="pix">PIX</option>
                </select>
              </div>
              <div>
                <span>Total:</span>
                <span>R$ {calcularTotal().toFixed(2)}</span>
              </div>
              <button onClick={finalizarVenda} className={styles.btnFinalizar}>
                <i className="fas fa-check-circle"></i> Finalizar Venda
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal de Personalização */}
      {modalOpen && produtoPersonalizar && (
        <PersonalizationModal
          produto={produtoPersonalizar}
          onClose={() => setModalOpen(false)}
          onConfirm={finalizarPersonalizacao}
        />
      )}
    </div>
  );
};

export default PDV;
