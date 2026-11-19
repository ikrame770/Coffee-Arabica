import React, { useEffect, useState } from 'react';
import { userApi, getAuth } from '../auth';

const EMPTY_FORM = {
  firstName: '', lastName: '', username: '',
  email: '', phone: '', password: '', role: 'BARISTA'
};

function Users() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);

  const currentUsername = getAuth()?.username;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setUsers(await userApi.getAll());
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditing(user);
    setForm({
      firstName: user.firstName, lastName: user.lastName,
      username: user.username, email: user.email,
      phone: user.phone || '', password: '', role: user.role
    });
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const { password, ...rest } = form;
        // mot de passe vide = inchangé : on n'envoie pas le champ
        await userApi.update(editing.id, password ? form : rest);
      } else {
        await userApi.create(form);
      }
      closeForm();
      loadUsers();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const toggleActive = async (user) => {
    if (user.active && !window.confirm(`Désactiver ${user.username} ?`)) return;
    try {
      await userApi.setActive(user.id, !user.active);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Chargement des utilisateurs...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">👥 Gestion des utilisateurs</h1>
        <button onClick={openCreate} className="btn btn-primary">
          ➕ Nouvel utilisateur
        </button>
      </div>

      {error && <p role="alert" className="error">{error}</p>}

      {users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3 className="empty-title">Aucun utilisateur</h3>
          <p>Commencez par créer un premier compte</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td><strong>{user.firstName} {user.lastName}</strong></td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                  <td>{user.active ? '✅ Actif' : '❌ Désactivé'}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(user)}
                      className="btn btn-sm btn-secondary"
                    >
                      ✏️ Modifier
                    </button>
                    {' '}
                    <button
                      onClick={() => toggleActive(user)}
                      disabled={user.username === currentUsername}
                      className={`btn btn-sm ${user.active ? 'btn-danger' : 'btn-success'}`}
                    >
                      {user.active ? '🔒 Désactiver' : '🔓 Activer'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div onClick={closeForm} className="modal-overlay">
          <div onClick={(e) => e.stopPropagation()} className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {editing ? '✏️ Modifier' : '➕ Ajouter'} un utilisateur
              </h2>
              <button onClick={closeForm} className="modal-close">×</button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                {formError && <p role="alert" className="error">{formError}</p>}

                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">Prénom *</label>
                  <input id="firstName" name="firstName" className="form-input"
                         value={form.firstName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">Nom *</label>
                  <input id="lastName" name="lastName" className="form-input"
                         value={form.lastName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="username" className="form-label">Nom d'utilisateur *</label>
                  <input id="username" name="username" className="form-input"
                         value={form.username} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input id="email" name="email" type="email" className="form-input"
                         value={form.email} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Téléphone</label>
                  <input id="phone" name="phone" className="form-input"
                         value={form.phone} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Mot de passe {editing ? '(laisser vide pour ne pas changer)' : '*'}
                  </label>
                  <input id="password" name="password" type="password"
                         className="form-input" value={form.password}
                         onChange={handleChange} required={!editing} />
                </div>

                <div className="form-group">
                  <label htmlFor="role" className="form-label">Rôle *</label>
                  <select id="role" name="role" className="form-select"
                          value={form.role} onChange={handleChange}>
                    <option value="BARISTA">☕ Barista</option>
                    <option value="ADMIN">👑 Admin</option>
                  </select>
                </div>

                <div className="flex gap-1">
                  <button type="submit" className="btn btn-success">
                    {editing ? '💾 Enregistrer' : '➕ Créer'}
                  </button>
                  <button type="button" onClick={closeForm} className="btn btn-secondary">
                    ❌ Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;