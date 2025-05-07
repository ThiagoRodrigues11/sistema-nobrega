const API_URL = 'http://localhost:5000/api';

export async function createSale(saleData) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/vendas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify({
      ...saleData,
      created_at: new Date().toISOString()
    })
  });
  if (!res.ok) throw new Error('Erro ao registrar venda');
  return await res.json();
}

export async function getSales(period = 'today') {
  const token = localStorage.getItem('token');
  let url = `${API_URL}/vendas?_expand=usuario`;
  
  if (period === 'today') {
    const today = new Date().toISOString().split('T')[0];
    url += `&created_at_gte=${today}`;
  } else if (period === 'month') {
    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString().split('T')[0];
    url += `&created_at_gte=${firstDay}`;
  }

  const res = await fetch(url, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  if (!res.ok) throw new Error('Erro ao buscar vendas');
  return await res.json();
}

export async function getSaleDetails(saleId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/vendas/${saleId}?_embed=itens_venda`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  if (!res.ok) throw new Error('Erro ao buscar detalhes da venda');
  return await res.json();
}