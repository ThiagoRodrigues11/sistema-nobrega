import { get, post } from './api';

export async function createSale(saleData) {
  try {
    const response = await post('/vendas', {
      ...saleData,
      created_at: new Date().toISOString()
    });
    return response;
  } catch (error) {
    throw new Error('Erro ao registrar venda');
  }
}

export async function getSales(period = 'today') {
  try {
    const response = await get(`/vendas?period=${period}`);
    return response;
  } catch (error) {
    throw new Error('Erro ao buscar vendas');
  }
}

export async function getSaleDetails(saleId) {
  try {
    const response = await get(`/vendas/${saleId}?_embed=itens_venda`);
    return response;
  } catch (error) {
    throw new Error('Erro ao buscar detalhes da venda');
  }
}