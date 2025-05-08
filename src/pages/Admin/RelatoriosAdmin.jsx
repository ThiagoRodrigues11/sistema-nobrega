import React, { useEffect, useState } from 'react';
import { getSales, getSaleDetails } from '../../api/vendas';
import styles from './RelatoriosAdmin.module.css';

const formatarFormaPagamento = (forma) => {
  const formas = {
    dinheiro: 'Dinheiro',
    cartao_debito: 'Cartão de Débito',
    cartao_credito: 'Cartão de Crédito',
    pix: 'PIX'
  };
  return formas[forma] || forma;
};

const RelatoriosAdmin = () => {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('today');
  const [detalhesVenda, setDetalhesVenda] = useState(null);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  useEffect(() => {
    setLoading(true);
    getSales(periodo)
      .then(setVendas)
      .finally(() => setLoading(false));
  }, [periodo]);

  if (loading) return <div className={styles.loading}>Carregando vendas...</div>;

  const total = vendas.reduce((sum, v) => sum + (Number(v.total) || 0), 0);
  const quantidadeVendas = vendas.length;
  const ticketMedio = quantidadeVendas > 0 ? total / quantidadeVendas : 0;

  const verDetalhes = async (vendaId) => {
    try {
      const detalhes = await getSaleDetails(vendaId);
      setDetalhesVenda(detalhes);
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
    }
  };

  const exportarExcel = () => {
    // Criar dados para o Excel
    const dados = vendas.map(venda => ({
      ID: venda.id,
      Data: new Date(venda.created_at).toLocaleDateString('pt-BR') + ' ' + new Date(venda.created_at).toLocaleTimeString('pt-BR'),
      Vendedor: venda.usuario?.nome || 'N/A',
      'Forma de Pagamento': formatarFormaPagamento(venda.forma_pagamento) || 'N/A',
      'Total (R$)': Number(venda.total || 0).toFixed(2).replace('.', ','),
      Status: venda.status || 'N/A'
    }));

    // Gerar CSV com ; e todos os campos entre aspas
    const headers = Object.keys(dados[0]);
    const csvContent = [
      headers.join(';'),
      ...dados.map(row => headers.map(header => `"${row[header]}"`).join(';'))
    ].join('\r\n');

    // Baixar arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `vendas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      <h2>Relatórios de Vendas</h2>
      
      <div className={styles.filtros}>
        <div className={styles.filtroGrupo}>
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
            <option value="today">Hoje</option>
            <option value="month">Este Mês</option>
            <option value="all">Todos</option>
            <option value="custom">Personalizado</option>
          </select>

          {periodo === 'custom' && (
            <>
              <input 
                type="date" 
                value={dataInicio} 
                onChange={(e) => setDataInicio(e.target.value)}
                placeholder="Data Início"
              />
              <input 
                type="date" 
                value={dataFim} 
                onChange={(e) => setDataFim(e.target.value)}
                placeholder="Data Fim"
              />
            </>
          )}
        </div>

        <button onClick={exportarExcel} className={styles.btnExcel}>
          <i className="fas fa-file-excel"></i> Exportar Excel
        </button>
      </div>

      <div className={styles.resumo}>
        <div className={styles.card}>
          <h3>Total de Vendas</h3>
          <p>R$ {total.toFixed(2)}</p>
        </div>
        <div className={styles.card}>
          <h3>Quantidade de Vendas</h3>
          <p>{quantidadeVendas}</p>
        </div>
        <div className={styles.card}>
          <h3>Ticket Médio</h3>
          <p>R$ {ticketMedio.toFixed(2)}</p>
        </div>
      </div>

      <div className={styles.tabelaContainer}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data/Hora</th>
              <th>Vendedor</th>
              <th>Forma de Pagamento</th>
              <th>Total</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map(venda => (
              <tr key={venda.id}>
                <td>{venda.id}</td>
                <td>{new Date(venda.created_at).toLocaleString()}</td>
                <td>{venda.usuario?.nome || 'N/A'}</td>
                <td>{formatarFormaPagamento(venda.forma_pagamento)}</td>
                <td>R$ {Number(venda.total || 0).toFixed(2)}</td>
                <td>{venda.status}</td>
                <td>
                  <button onClick={() => verDetalhes(venda.id)}>
                    Ver Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detalhesVenda && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Detalhes da Venda #{detalhesVenda.id}</h3>
            <table className={styles.tabela}>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Preço Unit.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detalhesVenda.itens_venda?.map(item => (
                  <tr key={item.id}>
                    <td>{item.produto?.nome}</td>
                    <td>{item.quantidade}</td>
                    <td>R$ {Number(item.preco_unitario || 0).toFixed(2)}</td>
                    <td>R$ {Number(item.quantidade * (item.preco_unitario || 0)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setDetalhesVenda(null)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatoriosAdmin;
