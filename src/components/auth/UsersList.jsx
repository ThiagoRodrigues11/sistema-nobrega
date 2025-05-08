import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UsersList.module.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/usuarios`, {
      headers: {
        'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
      }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao buscar usuários.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.title}>Usuários</div>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Username</th>
            <th>Nível</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.nome}</td>
              <td>{u.email}</td>
              <td>{u.username}</td>
              <td>{u.nivel_acesso}</td>
              <td>
                <button className={styles.editBtn} onClick={() => navigate(`/admin/usuarios/editar/${u._id}`)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersList;
