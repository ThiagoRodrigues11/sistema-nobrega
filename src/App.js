import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import Layout from './components/ui/Layout';
import LoginPage from './pages/Auth/LoginPage';
import PostsList from './components/blog/PostsList';
import PostDetail from './components/blog/PostDetail';
import PostForm from './components/blog/PostForm';
import DeletePostConfirm from './components/blog/DeletePostConfirm';
import PDV from './pages/PDV';
import PrivateRoute from './components/auth/PrivateRoute';
import Dashboard from './pages/Admin/Dashboard';
import ProdutosAdmin from './pages/Admin/ProdutosAdmin';
import CategoriasAdmin from './pages/Admin/CategoriasAdmin';
import CategoriasProdutosAdmin from './pages/Admin/CategoriasProdutosAdmin';
import AdminCategories from './components/blog/AdminCategories';
import PrivateAdminRoute from './components/blog/PrivateAdminRoute';
import UserCreate from './components/auth/UserCreate';
import UsersList from './components/auth/UsersList';
import UserEdit from './components/auth/UserEdit';
import UsuariosAdmin from './pages/Admin/UsuariosAdmin';
import RelatoriosAdmin from './pages/Admin/RelatoriosAdmin';
import RequireAuthOrLogin from './RequireAuthOrLogin';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<RequireAuthOrLogin />} />
            {/* Blog rotas */}
            <Route path="/blog" element={<PostsList />} />
            <Route path="/blog/novo" element={<PostForm />} />
            <Route path="/blog/editar/:id" element={<PostForm editMode={true} />} />
            
            <Route path="/blog/:id" element={<PostDetail />} />
            {/* Outras rotas */}
            <Route element={<PrivateRoute />}>
              <Route path="/pdv" element={<PDV />} />
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/produtos" element={<ProdutosAdmin />} />
              <Route path="/admin/categorias" element={<CategoriasAdmin />} />
              <Route path="/admin/categorias-produto" element={<CategoriasProdutosAdmin />} />
              <Route path="/admin/usuarios" element={<UsuariosAdmin />} />
              <Route path="/admin/relatorios" element={<RelatoriosAdmin />} />
            </Route>
            {/* Apenas admin pode criar/editar categorias de posts */}
            <Route path="/admin/categorias-post" element={
              <PrivateAdminRoute>
                <AdminCategories />
              </PrivateAdminRoute>
            } />
            <Route path="/admin/criar-usuario" element={
              <PrivateAdminRoute>
                <UserCreate />
              </PrivateAdminRoute>
            } />
            <Route path="/admin/usuarios" element={
              <PrivateAdminRoute>
                <UsersList />
              </PrivateAdminRoute>
            } />
            <Route path="/admin/usuarios/editar/:id" element={
              <PrivateAdminRoute>
                <UserEdit />
              </PrivateAdminRoute>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;