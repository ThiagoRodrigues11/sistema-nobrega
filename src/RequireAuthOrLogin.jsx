import React from 'react';
import { useAuth } from './components/auth/AuthProvider';
import { Navigate } from 'react-router-dom';
import PostsList from './components/blog/PostsList';

export default function RequireAuthOrLogin() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <PostsList />;
}
