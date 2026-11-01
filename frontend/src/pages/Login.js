import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAdmin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    const ADMIN_USERNAME = process.env.REACT_APP_ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('adminAuth', 'true');
      setIsAdmin(true);
      navigate('/admin');
    } else {
      setError('Identifiants incorrects !');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">🔐</div>
        <h2 className="login-title">Espace Administrateur</h2>
        <p className="login-subtitle">
          Connectez-vous pour accéder au panneau d'administration
        </p>
        
        {error && (
          <div className="alert alert-error">⚠️ {error}</div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Nom d'utilisateur</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre nom d'utilisateur"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            🔓 Se connecter
          </button>
        </form>

        
      </div>
    </div>
  );
}

export default Login;