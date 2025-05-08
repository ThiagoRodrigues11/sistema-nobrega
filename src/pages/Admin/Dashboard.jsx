import React from 'react';

const Dashboard = () => (
  <div>
    <h2>Dashboard Administrativo</h2>
    <ul>
      <li><a href="/admin/produtos">Gestão de Produtos</a></li>
      <li><a href="/admin/categorias">Gestão de Categorias</a></li>
      <li><a href="/admin/usuarios">Gestão de Usuários</a></li>
      <li><a href="/admin/relatorios">Relatórios de Vendas</a></li>
    </ul>
  </div>
);

export default Dashboard;
