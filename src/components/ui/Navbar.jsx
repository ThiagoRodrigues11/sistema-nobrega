import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  console.log('USER NO NAVBAR:', user);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>
        <Link to="/">Nobrega Confeccões</Link>
      </div>
      <div className={styles.navLinks}>
        {user && (
          <>
            <Link to="/pdv" className={styles.navLink}>PDV</Link>
            {(user.role === 'admin' || user.isAdmin || user.nivel_acesso === 'admin') && (
              <>
                <Link to="/admin/produtos" className={styles.navLink}>Gerenciar Produtos</Link>
                <Link to="/admin/categorias-produto" className={styles.navLink}>Categorias Produtos</Link>
                <Link to="/admin/relatorios" className={styles.navLink}>Relatórios</Link>
                <Link to="/admin/categorias-post" className={styles.navLink}>Categorias de Posts</Link>
                <Link to="/admin/criar-usuario" className={styles.navLink}>Criar Usuário</Link>
                <Link to="/admin/usuarios" className={styles.navLink}>Usuários</Link>
              </>
            )}
            <button onClick={logout} className={styles.navLink}>Sair</button>
          </>
        )}
      </div>
    </nav>
  );
}