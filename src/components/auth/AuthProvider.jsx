import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      const response = await api.login(username, password);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    navigate('/login');
  };

  // Busca user do backend ao iniciar, se houver token
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.getMe(); // precisa implementar no backend/api
        setUser(res.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const isAuthenticated = !!user;

  if (loading) {
    return <div style={{textAlign:'center',marginTop:40}}>Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}