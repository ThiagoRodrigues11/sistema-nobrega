import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

// Rota protegida apenas para admins
const PrivateAdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || !(user.role === 'admin' || user.isAdmin || user.nivel_acesso === 'admin')) {
    return <Navigate to="/" />;
  }
  return children;
};

export default PrivateAdminRoute;
