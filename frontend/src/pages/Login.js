import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../auth';

function Login({ setIsAdmin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      if (setIsAdmin) setIsAdmin(true);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
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
          <div className="alert alert-error" role="alert">⚠️ {error}</div>
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