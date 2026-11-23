import React, { useEffect, useState } from 'react';
import { apiFetch } from '../auth';

function Admin() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: 'COFFEE', image: '', available: true
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setProducts(await apiFetch('/products'));
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiFetch(editing ? `/products/${editing.id}` : '/products', {
        method: editing ? 'PUT' : 'POST',
        body: JSON.stringify(form)
      });

      setShowForm(false);
      setEditing(null);
      setForm({ name: '', description: '', price: '', category: 'COFFEE', image: '', available: true });
      loadProducts();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (product) => {
    setEditing(product);
    setForm(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce produit ?')) {
      try {
        await apiFetch(`/products/${id}`, { method: 'DELETE' });
        loadProducts();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', description: '', price: '', category: 'COFFEE', image: '', available: true });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">⚙️ Administration des produits</h1>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          ➕ Nouveau Produit
        </button>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3 className="empty-title">Aucun produit</h3>
          <p>Commencez par ajouter votre premier produit</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prix</th>
                <th>Catégorie</th>
                <th>Disponible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td><strong>{product.name}</strong></td>
                  <td>{product.price} MAD</td>
                  <td>{product.category}</td>
                  <td>{product.available ? '✅' : '❌'}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(product)}
                      className="btn btn-sm btn-secondary"
                    >
                      ✏️ Modifier
                    </button>
                    {' '}
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="btn btn-sm btn-danger"
                    >
                      🗑️ Supprimer
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
                {editing ? '✏️ Modifier' : '➕ Ajouter'} un produit
              </h2>
              <button onClick={closeForm} className="modal-close">×</button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nom *</label>
                  <input
                    className="form-input"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Prix (MAD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={form.price}
                    onChange={(e) => setForm({...form, price: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Catégorie *</label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                  >
                    <option value="COFFEE">☕ Café</option>
                    <option value="CREPE">🥞 Crêpe</option>
                    <option value="CAKE">🍰 Gâteau</option>
                    <option value="BEVERAGE">🥤 Boisson</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    className="form-input"
                    value={form.image}
                    onChange={(e) => setForm({...form, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex gap-1">
                  <button type="submit" className="btn btn-success">
                    {editing ? '💾 Modifier' : '➕ Ajouter'}
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

export default Admin;