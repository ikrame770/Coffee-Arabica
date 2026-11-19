import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, logout } from '../auth';

function Navbar({ isAdmin, setIsAdmin }) {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = () => {
    logout();                                // sessionStorage "auth"
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-title">Arabica</div>
          <div className="logo-tagline">All you need is love and coffee</div>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="nav-link"> Accueil</Link>
          <Link to="/menu" className="nav-link"> Menu</Link>
          <Link to="/about" className="nav-link"> À Propos</Link>

          {isAdmin ? (
            <>
              <Link to="/orders" className="nav-link"> Commandes</Link>
              <Link to="/admin" className="nav-link"> Product</Link>
              {auth?.role === 'ADMIN' && (
                <>
                  <Link to="/admindashboard" className="nav-link"> Dashboard</Link>
                  <Link to="/admin/users" className="nav-link"> Utilisateurs</Link>
                </>
              )}
              <button onClick={handleLogout} className="nav-link logout-btn">
                🚪 Déconnexion
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link admin-btn">🔐 Admin</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;